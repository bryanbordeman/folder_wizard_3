'''==========================================
Title:  get_opportunity.py
Author:  Bryan Bordeman
Start Date:  111421
Updated:  
Version:  support script

;=========================================='''


import sys
import os
import os.path
from database import execute_db_query

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
database = os.path.join(BASE_DIR, "protaskinate.db")
quote = sys.argv[1]

def main():
    quote_list = get_opportunity(quote)
    for i in quote_list:
        print(i)
    # print(quote_list)

def get_opportunity(quote):
    '''fetch opportunity data from database'''

    table = 'opportunity'

    table_str = execute_db_query(
        f"""SELECT * FROM {table} WHERE quote_number = '{quote}';""")  # makes

    try:
        opp_list = list(table_str)[0]  # make table data into list
    except IndexError:
        opp_list = []

    return opp_list


if __name__ == "__main__":
    main()
