"""
ETL Pipeline - Step 1: Load Transportation Data from Kaggle
This script loads the transportation and logistics tracking dataset from Kaggle.
"""

import kagglehub
from kagglehub import KaggleDatasetAdapter
import pandas as pd
import json
from pathlib import Path

def load_kaggle_dataset():
    """Load the transportation dataset from Kaggle"""
    print("[] Loading dataset from Kaggle...")
    
    try:
        # Load the latest version of the dataset
        df = kagglehub.load_dataset(
            KaggleDatasetAdapter.PANDAS,
            "nicolemachado/transportation-and-logistics-tracking-dataset",
            "",  # Load all files
        )
        
        print(f"[] Dataset loaded successfully. Shape: {df.shape}")
        print(f"[] Columns: {df.columns.tolist()}")
        print(f"[] First 5 records:\n{df.head()}")
        
        return df
    
    except Exception as e:
        print(f"[] Error loading dataset: {e}")
        # Return sample data for development
        return create_sample_data()

def create_sample_data():
    """Create sample transportation data for development"""
    print("[] Creating sample data for development...")
    
    sample_data = {
        'shipment_id': [f'SH{i:05d}' for i in range(1, 101)],
        'origin_city': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] * 20,
        'destination_city': ['Miami', 'Seattle', 'Boston', 'Dallas', 'Denver'] * 20,
        'origin_state': ['NY', 'CA', 'IL', 'TX', 'AZ'] * 20,
        'destination_state': ['FL', 'WA', 'MA', 'TX', 'CO'] * 20,
        'distance_miles': [1200, 1100, 900, 800, 1000] * 20,
        'weight_lbs': [15000, 20000, 18000, 22000, 16000] * 20,
        'freight_type': ['Dry Van', 'Refrigerated', 'Flatbed', 'Dry Van', 'Refrigerated'] * 20,
        'carrier_id': [f'CAR{i:03d}' for i in range(1, 21)] * 5,
        'carrier_name': [f'Carrier {i}' for i in range(1, 21)] * 5,
        'rate_per_mile': [2.5, 3.0, 2.8, 3.2, 2.9] * 20,
        'total_cost': [3000, 3300, 2520, 2560, 2900] * 20,
        'delivery_time_hours': [24, 30, 18, 20, 26] * 20,
        'on_time_delivery': [True, True, False, True, True] * 20,
        'carrier_rating': [4.5, 4.8, 4.2, 4.6, 4.7] * 20,
    }
    
    return pd.DataFrame(sample_data)

def save_raw_data(df):
    """Save raw data to JSON for API consumption"""
    output_dir = Path('public/data')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = output_dir / 'raw_shipments.json'
    
    # Convert to JSON-serializable format
    data_dict = df.to_dict(orient='records')
    
    with open(output_file, 'w') as f:
        json.dump(data_dict, f, indent=2)
    
    print(f"[] Raw data saved to {output_file}")
    print(f"[] Total records: {len(data_dict)}")

def main():
    """Main ETL execution"""
    print("[] Starting ETL Pipeline - Data Loading")
    
    # Load dataset
    df = load_kaggle_dataset()
    
    # Save raw data
    save_raw_data(df)
    
    print("[] ETL Step 1 Complete: Data loaded and saved")
    
    return df

if __name__ == "__main__":
    df = main()
