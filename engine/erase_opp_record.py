import sys
import os
import os.path

from database import execute_db_query

def main():
    inputs = sys.argv[1] # input string
    inputDict = eval('dict('+inputs+')') # convert input string into dict
    erase_opp_record(inputDict)
    print('Opportunity Record Erased')

def erase_opp_record(inputs):
    '''fetch opportunity data from database'''
    table = 'opportunity'
    execute_db_query(f"""DELETE FROM {table} WHERE quote_number = '{inputs['quote_number']}';""")  # makes

if __name__ == "__main__":
    main()