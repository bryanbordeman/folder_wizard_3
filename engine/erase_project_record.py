import sys
import os
import os.path

from database import execute_db_query

def main():
    inputs = sys.argv[1] # input string
    inputDict = eval('dict('+inputs+')') # convert input string into dict
    erase_project_record(inputDict)
    print(f"{inputDict['p_sort']} Record Erased")

def erase_project_record(inputs):
    '''fetch project data from database'''
    table = str(inputs['p_sort'])
    execute_db_query(f"""DELETE FROM {table} WHERE project_number = '{inputs['p_project_number']}';""")  # makes

if __name__ == "__main__":
    main()