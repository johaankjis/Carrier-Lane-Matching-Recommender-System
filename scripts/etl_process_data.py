"""
ETL Pipeline - Step 2: Process and Transform Data
This script processes the raw transportation data and prepares it for ML modeling.
"""

import pandas as pd
import json
from pathlib import Path
import numpy as np

def load_raw_data():
    """Load raw shipment data"""
    data_file = Path('public/data/raw_shipments.json')
    
    if not data_file.exists():
        print("[v0] Raw data not found. Please run etl_load_data.py first.")
        return None
    
    with open(data_file, 'r') as f:
        data = json.load(f)
    
    df = pd.DataFrame(data)
    print(f"[v0] Loaded {len(df)} raw records")
    
    return df

def clean_data(df):
    """Clean and validate data"""
    print("[v0] Cleaning data...")
    
    # Remove duplicates
    initial_count = len(df)
    df = df.drop_duplicates(subset=['shipment_id'])
    print(f"[v0] Removed {initial_count - len(df)} duplicate records")
    
    # Handle missing values
    df = df.dropna(subset=['origin_city', 'destination_city', 'carrier_id'])
    
    # Ensure numeric columns are correct type
    numeric_columns = ['distance_miles', 'weight_lbs', 'rate_per_mile', 'total_cost', 'delivery_time_hours', 'carrier_rating']
    for col in numeric_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    
    print(f"[v0] Data cleaned. Final record count: {len(df)}")
    
    return df

def create_lane_features(df):
    """Create lane-level features for matching"""
    print("[v0] Creating lane features...")
    
    # Create lane identifier
    df['lane_id'] = df['origin_city'] + '_' + df['destination_city']
    
    # Aggregate lane-level statistics
    lane_stats = df.groupby('lane_id').agg({
        'distance_miles': 'mean',
        'weight_lbs': 'mean',
        'rate_per_mile': 'mean',
        'total_cost': 'mean',
        'delivery_time_hours': 'mean',
        'shipment_id': 'count',
        'origin_city': 'first',
        'destination_city': 'first',
        'origin_state': 'first',
        'destination_state': 'first',
        'freight_type': lambda x: x.mode()[0] if len(x.mode()) > 0 else x.iloc[0]
    }).reset_index()
    
    lane_stats.rename(columns={'shipment_id': 'shipment_count'}, inplace=True)
    
    print(f"[v0] Created {len(lane_stats)} unique lanes")
    
    return lane_stats

def create_carrier_features(df):
    """Create carrier-level features for matching"""
    print("[v0] Creating carrier features...")
    
    # Aggregate carrier-level statistics
    carrier_stats = df.groupby('carrier_id').agg({
        'carrier_name': 'first',
        'rate_per_mile': 'mean',
        'total_cost': 'mean',
        'delivery_time_hours': 'mean',
        'on_time_delivery': lambda x: (x.sum() / len(x)) * 100,  # On-time percentage
        'carrier_rating': 'mean',
        'shipment_id': 'count',
        'distance_miles': 'mean',
        'weight_lbs': 'mean'
    }).reset_index()
    
    carrier_stats.rename(columns={
        'shipment_id': 'total_shipments',
        'on_time_delivery': 'on_time_percentage'
    }, inplace=True)
    
    print(f"[v0] Created profiles for {len(carrier_stats)} carriers")
    
    return carrier_stats

def create_carrier_lane_history(df):
    """Create carrier-lane performance history"""
    print("[v0] Creating carrier-lane history...")
    
    df['lane_id'] = df['origin_city'] + '_' + df['destination_city']
    
    # Aggregate carrier performance per lane
    carrier_lane_stats = df.groupby(['carrier_id', 'lane_id']).agg({
        'carrier_name': 'first',
        'origin_city': 'first',
        'destination_city': 'first',
        'rate_per_mile': 'mean',
        'total_cost': 'mean',
        'delivery_time_hours': 'mean',
        'on_time_delivery': lambda x: (x.sum() / len(x)) * 100,
        'carrier_rating': 'mean',
        'shipment_id': 'count',
        'distance_miles': 'mean'
    }).reset_index()
    
    carrier_lane_stats.rename(columns={
        'shipment_id': 'lane_shipment_count',
        'on_time_delivery': 'lane_on_time_percentage'
    }, inplace=True)
    
    print(f"[v0] Created {len(carrier_lane_stats)} carrier-lane combinations")
    
    return carrier_lane_stats

def save_processed_data(lane_stats, carrier_stats, carrier_lane_stats):
    """Save processed data for ML and API"""
    output_dir = Path('public/data')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save lane features
    lane_file = output_dir / 'lanes.json'
    lane_stats.to_json(lane_file, orient='records', indent=2)
    print(f"[v0] Saved lane data to {lane_file}")
    
    # Save carrier features
    carrier_file = output_dir / 'carriers.json'
    carrier_stats.to_json(carrier_file, orient='records', indent=2)
    print(f"[v0] Saved carrier data to {carrier_file}")
    
    # Save carrier-lane history
    carrier_lane_file = output_dir / 'carrier_lane_history.json'
    carrier_lane_stats.to_json(carrier_lane_file, orient='records', indent=2)
    print(f"[v0] Saved carrier-lane history to {carrier_lane_file}")

def main():
    """Main processing execution"""
    print("[v0] Starting ETL Pipeline - Data Processing")
    
    # Load raw data
    df = load_raw_data()
    if df is None:
        return
    
    # Clean data
    df = clean_data(df)
    
    # Create features
    lane_stats = create_lane_features(df)
    carrier_stats = create_carrier_features(df)
    carrier_lane_stats = create_carrier_lane_history(df)
    
    # Save processed data
    save_processed_data(lane_stats, carrier_stats, carrier_lane_stats)
    
    print("[v0] ETL Step 2 Complete: Data processed and features created")

if __name__ == "__main__":
    main()
