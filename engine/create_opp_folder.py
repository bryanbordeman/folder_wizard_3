import os
import sys
import time
import os.path
from directory_list import directory_list

current_year = time.strftime("%Y")

def main():
    inputs = sys.argv[1] # input string
    # print(create_opportunity_folder(inputs))
    print('Opportunity Folder Created')

def createFolder(directory):
    try:
        if not os.path.exists(directory):
            os.makedirs(directory)
    except OSError:
        print('Error: Creating directory. ' + directory)

def create_opportunity_folder(quote):
    opportunity_dir = directory_list['opportunity_dir']
    opportunity_dir_list = (os.listdir(opportunity_dir)) # make list of folders in directory
    year_list = [] 

    # search for current year folder. If none exist make one
    for year in opportunity_dir_list:
            try:
                if int(year[:5]):
                    year_list.append(year) # add folder to list if its a year
            except ValueError:
                continue
    year_list.sort()
    if year_list[-1] == str(current_year):
        year_dir = current_year #make pointer to current year folder
    else:
        createFolder(f'{opportunity_dir}/{current_year} Quotes') # create new year folder
    
    # create opportunity folder and sub folders
    createFolder(f'{opportunity_dir}/{current_year} Quotes/{quote}/00_quotations_estimates')
    createFolder(f'{opportunity_dir}/{current_year} Quotes/{quote}/00_quotations_estimates/vendor_quotes')
    createFolder(f'{opportunity_dir}/{current_year} Quotes/{quote}/01_drawings_specs')
    createFolder(f'{opportunity_dir}/{current_year} Quotes/{quote}/02_rfi_addenda')
    createFolder(f'{opportunity_dir}/{current_year} Quotes/{quote}/03_photos')
    createFolder(f'{opportunity_dir}/{current_year} Quotes/{quote}/04_misc_docs')

    # open_folder(f'{opportunity_dir}/{current_year} Quotes/{quote}')
    directory = f'{opportunity_dir}/{current_year} Quotes/{quote}'
    return directory

if __name__ == "__main__":
    main()