#!/usr/bin/env python3

import json
import os
from datetime import datetime

import gspread

DATA_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "../assets/data"
)
TODAY = datetime.now().strftime("%Y-%m-%d")

def update_recnet_runs(rows):
    # row: ['2025-09-21', ' Sun ', '06:30 ', '00:57:29', '5.04', '11:23', '128', '145', '河堤', '5 公里', '13.7', '', '', '', '', '', '', '', '', '']
    # target: { "date": "2025-09-21", "time": "06:30", "duration": "00:57:29", "distance": "5.04", "pace": "11:23", "heartRate": "128", "cadence": "145" }
    recent_runs = []
    for row in rows:
        date_str = row[0].strip()
        time = row[2].strip()
        duration = row[3].strip()
        distance = row[4].strip()
        pace = row[5].strip()
        heart_rate = row[6].strip()
        cadence = row[7].strip()
        recent_runs.append({
            "date": date_str,
            "time": time,
            "duration": duration,
            "distance": distance,
            "pace": pace,
            "heartRate": heart_rate,
            "cadence": cadence
        })
    # reverse it, latest first
    recent_runs = recent_runs[::-1]

    output_data = {
        "lastUpdated": TODAY,
        "runs": recent_runs
    }
    output_path = os.path.join(DATA_DIR, "recent-runs.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    

def update_weekly_overview(rows):
    # row: ['09/15–09/21', '8.28km / 01:42:17 / 12:21', '', '3.24km / 13:50 / 104', '', '', '', '', '5.04km / 11:24 / 128']
    # target: { "dateRange": "09/15–09/21", "summary": "3.24km / 00:44:48 / 13:50", "days": [ "", "3.24km / 13:50 / 104", "", "", "", "", "" ] },
    weekly_overview = []
    for row in rows:
        date_range = row[0].strip()
        summary = row[1].strip()
        days = [cell.strip() for cell in row[2:9]]
        weekly_overview.append({
            "dateRange": date_range,
            "summary": summary,
            "days": days
        })
    # reverse it, latest first
    weekly_overview = weekly_overview[::-1]

    output_data = {
        "lastUpdated": TODAY,
        "weeks": weekly_overview
    }
    output_path = os.path.join(DATA_DIR, "weekly-overview.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)


def update_monthly_summary(rows):
    # row: ['2025-09', '36.1', '6', '6', '06:46:10', '10:07', '12.27', '162', '155']
    # target: { "month": "2025-09", "totalDistance": "31", "totalRuns": "5", "totalDuration": "05:48:41", "fastestPace": "10:07", "longestDistance": "12.27", "maxAvgHR": "162", "maxCadence": "155" }
    monthly_summary = []
    for row in rows:
        month = row[0].strip()
        total_distance = row[1].strip()
        total_runs = row[2].strip()
        total_duration = row[4].strip()
        fastest_pace = row[5].strip()
        longest_distance = row[6].strip()
        max_avg_hr = row[7].strip()
        max_cadence = row[8].strip()
        monthly_summary.append({
            "month": month,
            "totalDistance": total_distance,
            "totalRuns": total_runs,
            "totalDuration": total_duration,
            "fastestPace": fastest_pace,
            "longestDistance": longest_distance,
            "maxAvgHR": max_avg_hr,
            "maxCadence": max_cadence
        })
    # reverse it, latest first
    monthly_summary = monthly_summary[::-1]

    output_data = {
        "lastUpdated": TODAY,
        "months": monthly_summary
    }
    output_path = os.path.join(DATA_DIR, "monthly-summary.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)


def main():
    gc = gspread.service_account(filename='service-account-credentials.json')
    spreadsheet = gc.open("yee's daily")
    worksheet = spreadsheet.worksheet("跑步紀錄_raw")
    rows = worksheet.get_all_values()[1:]  # Skip header row
    update_recnet_runs(rows)
    worksheet = spreadsheet.worksheet("跑步紀錄_week")
    rows = worksheet.get_all_values()[1:]  # Skip header row
    update_weekly_overview(rows)
    worksheet = spreadsheet.worksheet("跑步紀錄_month")
    rows = worksheet.get_all_values()[1:]  # Skip header row
    update_monthly_summary(rows)


if __name__ == "__main__":
    main()
