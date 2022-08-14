import os
import sys
from shutil import rmtree

def main():
    inputs = sys.argv[1] # input string
    delete_folder(inputs)

def delete_folder(path):
    '''delete folder'''
    try:
        rmtree(path)
        print(f"Directory {path} has been removed successfully")
    except OSError as error:
        print(error)
        print(f"Directory {path} can not be removed")

if __name__ == "__main__":
    main()