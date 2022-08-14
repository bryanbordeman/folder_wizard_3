'''==========================================
Title:  zip_2_state.py
Author:  Bryan Bordeman
Start Date:  062219
Updated:  102321 (Fixed NYC Boroughs)
Version:  support script
Notes: Added JSON read function
;=========================================='''

import json


def main():
    '''for testing only'''
    while True:
    
        zip_var = int(input('Enter Zip Code: '))
        print(find_state(zip_var))
        if zip_var == 0: # break loop
            return False
            
def create_zip_list ():
    '''make list from json data'''
    f = open('../src/json/zipCode.json',)
    data = json.load(f)
    zip_code_list = []
    for i in data:
        zip_code_list.append(i)
    f.close()
    return zip_code_list

def find_state(zip_var):
    ''''returns state based on zip code'''
    global zip_code_list
    state = ''
    state_code = ''

    for i in range(len(zip_code_list)):
        if zip_code_list[i][2] <= zip_var <= zip_code_list[i][3]:
            # state = zip_code_list[i][0]
            state_code = f'{zip_code_list[i][0]}, {zip_code_list[i][1]}'
            break
        else:
            state_code = 'Invalid zip code'
    return state_code

zip_code_list = create_zip_list()

if __name__ == "__main__":
    main()
