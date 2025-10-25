"""
ETL Pipeline - Master Script
Run this script to execute the complete ETL pipeline.
"""

import sys
from pathlib import Path

# Add scripts directory to path
sys.path.append(str(Path(__file__).parent))

import etl_load_data
import etl_process_data

def main():
    """Execute complete ETL pipeline"""
    print("=" * 60)
    print("CARRIER LANE RECOMMENDER - ETL PIPELINE")
    print("=" * 60)
    
    try:
        # Step 1: Load data
        print("\n[STEP 1] Loading data from Kaggle...")
        df = etl_load_data.main()
        
        # Step 2: Process data
        print("\n[STEP 2] Processing and transforming data...")
        etl_process_data.main()
        
        print("\n" + "=" * 60)
        print("ETL PIPELINE COMPLETE")
        print("=" * 60)
        print("\nProcessed data files created:")
        print("  - public/data/raw_shipments.json")
        print("  - public/data/lanes.json")
        print("  - public/data/carriers.json")
        print("  - public/data/carrier_lane_history.json")
        print("\nYou can now run the ML model training script.")
        
    except Exception as e:
        print(f"\n[ERROR] ETL Pipeline failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
