"""
ML Model Training - Carrier-Lane Recommendation System
This script trains a recommendation model to match carriers to lanes.
"""

import pandas as pd
import json
from pathlib import Path
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity

def load_processed_data():
    """Load processed data from ETL pipeline"""
    data_dir = Path('public/data')
    
    with open(data_dir / 'lanes.json', 'r') as f:
        lanes = pd.DataFrame(json.load(f))
    
    with open(data_dir / 'carriers.json', 'r') as f:
        carriers = pd.DataFrame(json.load(f))
    
    with open(data_dir / 'carrier_lane_history.json', 'r') as f:
        history = pd.DataFrame(json.load(f))
    
    print(f"[v0] Loaded {len(lanes)} lanes, {len(carriers)} carriers, {len(history)} historical records")
    
    return lanes, carriers, history

def create_feature_vectors(lanes, carriers, history):
    """Create feature vectors for similarity matching"""
    print("[v0] Creating feature vectors...")
    
    # Lane features for matching
    lane_features = lanes[['lane_id', 'distance_miles', 'weight_lbs', 'rate_per_mile', 'shipment_count']].copy()
    
    # Carrier features for matching
    carrier_features = carriers[[
        'carrier_id', 'rate_per_mile', 'delivery_time_hours', 
        'on_time_percentage', 'carrier_rating', 'total_shipments'
    ]].copy()
    
    # Normalize features
    scaler_lanes = StandardScaler()
    scaler_carriers = StandardScaler()
    
    lane_numeric_cols = ['distance_miles', 'weight_lbs', 'rate_per_mile', 'shipment_count']
    carrier_numeric_cols = ['rate_per_mile', 'delivery_time_hours', 'on_time_percentage', 'carrier_rating', 'total_shipments']
    
    lane_features[lane_numeric_cols] = scaler_lanes.fit_transform(lane_features[lane_numeric_cols])
    carrier_features[carrier_numeric_cols] = scaler_carriers.fit_transform(carrier_features[carrier_numeric_cols])
    
    print(f"[v0] Feature vectors created and normalized")
    
    return lane_features, carrier_features

def calculate_recommendations(lanes, carriers, history, lane_features, carrier_features):
    """Calculate carrier recommendations for each lane"""
    print("[v0] Calculating recommendations...")
    
    recommendations = []
    
    for _, lane in lanes.iterrows():
        lane_id = lane['lane_id']
        
        # Get carriers who have serviced this lane before
        lane_history = history[history['lane_id'] == lane_id]
        
        carrier_scores = []
        
        for _, carrier in carriers.iterrows():
            carrier_id = carrier['carrier_id']
            
            # Base score calculation
            score = 0
            factors = {}
            
            # Factor 1: Historical performance on this lane (40% weight)
            carrier_lane_history = lane_history[lane_history['carrier_id'] == carrier_id]
            if len(carrier_lane_history) > 0:
                hist_record = carrier_lane_history.iloc[0]
                performance_score = (
                    (hist_record['lane_on_time_percentage'] / 100) * 0.5 +
                    (hist_record['carrier_rating'] / 5) * 0.3 +
                    (1 - (hist_record['rate_per_mile'] / lane['rate_per_mile'])) * 0.2
                )
                score += performance_score * 0.4
                factors['historical_performance'] = round(performance_score * 100, 2)
            else:
                factors['historical_performance'] = 0
            
            # Factor 2: Overall carrier reliability (30% weight)
            reliability_score = (
                (carrier['on_time_percentage'] / 100) * 0.6 +
                (carrier['carrier_rating'] / 5) * 0.4
            )
            score += reliability_score * 0.3
            factors['reliability'] = round(reliability_score * 100, 2)
            
            # Factor 3: Cost competitiveness (20% weight)
            cost_score = max(0, 1 - abs(carrier['rate_per_mile'] - lane['rate_per_mile']) / lane['rate_per_mile'])
            score += cost_score * 0.2
            factors['cost_competitiveness'] = round(cost_score * 100, 2)
            
            # Factor 4: Experience/volume (10% weight)
            experience_score = min(1, carrier['total_shipments'] / 100)
            score += experience_score * 0.1
            factors['experience'] = round(experience_score * 100, 2)
            
            # Convert to 0-100 scale
            final_score = score * 100
            
            carrier_scores.append({
                'lane_id': lane_id,
                'origin_city': lane['origin_city'],
                'destination_city': lane['destination_city'],
                'carrier_id': carrier_id,
                'carrier_name': carrier['carrier_name'],
                'match_score': round(final_score, 2),
                'estimated_rate': round(carrier['rate_per_mile'], 2),
                'estimated_cost': round(carrier['rate_per_mile'] * lane['distance_miles'], 2),
                'estimated_delivery_hours': round(carrier['delivery_time_hours'], 1),
                'carrier_rating': round(carrier['carrier_rating'], 2),
                'on_time_percentage': round(carrier['on_time_percentage'], 1),
                'has_lane_history': len(carrier_lane_history) > 0,
                'score_factors': factors
            })
        
        # Sort by match score and take top 10
        carrier_scores.sort(key=lambda x: x['match_score'], reverse=True)
        recommendations.extend(carrier_scores[:10])
    
    print(f"[v0] Generated {len(recommendations)} recommendations")
    
    return recommendations

def save_recommendations(recommendations):
    """Save recommendations to JSON"""
    output_dir = Path('public/data')
    output_file = output_dir / 'recommendations.json'
    
    with open(output_file, 'w') as f:
        json.dump(recommendations, f, indent=2)
    
    print(f"[v0] Recommendations saved to {output_file}")

def generate_model_metrics(recommendations, history):
    """Generate model performance metrics"""
    print("[v0] Generating model metrics...")
    
    # Calculate metrics
    total_recommendations = len(recommendations)
    lanes_covered = len(set([r['lane_id'] for r in recommendations]))
    carriers_recommended = len(set([r['carrier_id'] for r in recommendations]))
    avg_match_score = np.mean([r['match_score'] for r in recommendations])
    
    # Recommendations with historical data
    with_history = sum([1 for r in recommendations if r['has_lane_history']])
    history_percentage = (with_history / total_recommendations) * 100
    
    metrics = {
        'model_version': '1.0',
        'training_date': pd.Timestamp.now().isoformat(),
        'total_recommendations': total_recommendations,
        'unique_lanes': lanes_covered,
        'unique_carriers': carriers_recommended,
        'avg_match_score': round(avg_match_score, 2),
        'recommendations_with_history': with_history,
        'history_coverage_percentage': round(history_percentage, 2),
        'scoring_weights': {
            'historical_performance': 0.4,
            'reliability': 0.3,
            'cost_competitiveness': 0.2,
            'experience': 0.1
        }
    }
    
    # Save metrics
    output_dir = Path('public/data')
    metrics_file = output_dir / 'model_metrics.json'
    
    with open(metrics_file, 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print(f"[v0] Model metrics saved to {metrics_file}")
    print(f"[v0] Average match score: {avg_match_score:.2f}")
    print(f"[v0] History coverage: {history_percentage:.1f}%")
    
    return metrics

def main():
    """Main ML training execution"""
    print("[v0] Starting ML Model Training")
    
    # Load data
    lanes, carriers, history = load_processed_data()
    
    # Create feature vectors
    lane_features, carrier_features = create_feature_vectors(lanes, carriers, history)
    
    # Calculate recommendations
    recommendations = calculate_recommendations(lanes, carriers, history, lane_features, carrier_features)
    
    # Save recommendations
    save_recommendations(recommendations)
    
    # Generate metrics
    metrics = generate_model_metrics(recommendations, history)
    
    print("[v0] ML Model Training Complete")

if __name__ == "__main__":
    main()
