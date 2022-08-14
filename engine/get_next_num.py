'''==========================================
Title:  get_next_num.py
Author:  Bryan Bordeman
Start Date:  062219
Updated:  102521 (added next_service_num())
Version:  support script

;=========================================='''

import time
import sqlite3
import sys
import os
import os.path
from database import execute_db_query

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
database = os.path.join(BASE_DIR, "protaskinate.db")


def main():
    data_type = sys.argv[1]
    print(get_next_num(data_type))
    # print(get_next_num("service"))

def get_next_num(data_type):
    '''fetch opportunity from database'''
    year = time.strftime("%Y")[2:]

    if data_type == 'opportunity':
        table = 'opportunity'

        table_str = execute_db_query(
            f"SELECT * FROM {table} ORDER BY rowid DESC LIMIT 1;")  # makes

        last_quote_number = (table_str.fetchall()[0][1])
        current_quote_year = last_quote_number[1:3]

        if current_quote_year == year:
            next_number = int(last_quote_number[4:])+1
            for i in range(3):
                if len(str(next_number)) < 3:
                    next_number = '0' + str(next_number)
            next_number_str = f'Q{current_quote_year}-{str(next_number)}'
        else:
            next_number = '001'
            next_number_str = f'Q{year}-{str(next_number)}'

        return next_number_str

    elif data_type == "project":
        table = 'project'

        table_str = execute_db_query(
            f"SELECT * FROM {table} ORDER BY rowid DESC LIMIT 1;")  # makes

        last_project_number = (table_str.fetchall()[0][1])
        current_project_year = last_project_number[-2:]

        if current_project_year == year:
            next_number = int(last_project_number[:3])+1
            next_number_str = f'{next_number}{current_project_year}'
        else:
            next_number = '100'
            next_number_str = f'{next_number}{year}'

        return next_number_str

    elif data_type == "service":
        table = 'service'

        table_str = execute_db_query(
            f"SELECT * FROM {table} ORDER BY rowid DESC LIMIT 1;")  # makes

        last_service_number = (table_str.fetchall()[0][1])
        current_service_year = last_service_number[:2]

        # print(last_service_number)
        # print(current_service_year)
        # print(current_service_year == year)

        if current_service_year == year:
            next_number = int(last_service_number[-3:])+1
            # print(len(str(next_number)))
            if len(str(next_number)) == 1:
                next_number_str = f'{str(current_service_year)}00{str(next_number)}'
            elif len(str(next_number)) == 2:
                next_number_str = f'{str(current_service_year)}0{str(next_number)}'
                print(next_number_str)
            elif len(str(next_number)) == 3:
                next_number_str = f'{str(current_service_year)}{str(next_number)}'
        else:
            next_number = '001'
            next_number_str = f'{year}{str(next_number)}'

        return next_number_str

    elif data_type == "HSE":
        year = time.strftime("%Y")[2:]
        table = 'HSE'

        table_str = execute_db_query(
                f"SELECT * FROM {table} ORDER BY rowid DESC LIMIT 1;")  # makes

        last_HSE_number = (table_str.fetchall()[0][1])
        current_service_year = last_HSE_number[3:5]

        if current_service_year == year:
            next_number = int(last_HSE_number[-2:])+1
            if len(str(next_number)) == 1:
                next_number_str = f'HSE{current_service_year}0{next_number}'
            elif len(str(next_number)) == 2:
                next_number_str = f'HSE{current_service_year}{next_number}'
        else:
            next_number = '01'
            next_number_str = f'HSE{year}{next_number}'

        return next_number_str


if __name__ == "__main__":
    main()
