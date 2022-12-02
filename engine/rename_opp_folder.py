import os
import sys
import os.path
import time
from directory_list import directory_list

def main():
    inputs = sys.argv # inputs list
    #* inputs[1] = exisitng directory
    #* inputs[2] = new directory
    print(rename_opportunity_folder(inputs[1], inputs[2]))
    # print('Opportunity Folder Renamed')

def renameFolder(existing_dir, new_dir):
    try:
        if os.path.exists(existing_dir):
            os.rename(existing_dir, new_dir)
            print('Renamed!!')
        else:
            print('Error: renaming directory. ' + existing_dir)
    except OSError:
        print('Error: renaming directory. ' + existing_dir)

def rename_opportunity_folder(existing, new):
    is_quote = existing[0] == 'Q' # check string to confirm its a quote number
    
    if is_quote:
        quote_year = f'20{existing[1:3]}' 
    else:
        quote_year = time.strftime("%Y")

    opportunity_dir = directory_list['opportunity_dir']
    quote_dir = f'{opportunity_dir}/{quote_year} Quotes/{existing}'
    new_dir = f'{opportunity_dir}/{quote_year} Quotes/{new}'
    renameFolder(quote_dir, new_dir)

    return new_dir

if __name__ == "__main__":
    main()