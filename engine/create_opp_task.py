import os
import sys
import os.path
from datetime import datetime 

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ['https://www.googleapis.com/auth/tasks']
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..', 'src/json'))

def main():
    inputs = sys.argv[1] # input string
    inputDict = eval('dict('+inputs+')') # convert input string into dict
    create_task(inputDict)
 
def create_task(inputs):
    """Shows basic usage of the Tasks API.
    Prints the title and ID of the first 10 task lists.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists(os.path.join(BASE_DIR, "token.json")):
        creds = Credentials.from_authorized_user_file(os.path.join(BASE_DIR, "token.json"), SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                os.path.join(BASE_DIR, "credentials.json"), SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(os.path.join(BASE_DIR, "token.json"), 'w') as token:
            token.write(creds.to_json())

    try:
        service = build('tasks', 'v1', credentials=creds)

        due_date_list = inputs['due_date'].split('-') # break string into list
        due_date = f'{due_date_list[1]}/{due_date_list[2]}/{due_date_list[0][-2:]}' #reformat mm/dd/YYYY
        due_date = datetime.strptime(due_date, '%m/%d/%y') #convert type to datetime
        due_date = due_date.astimezone().isoformat() #convert to RFC 3339 timestamp

        title = f"{inputs['quote_number']} {inputs['project_name']} {inputs['type_code']}"
        task_description = 'Proposal / Estimate'
        taskdata = { 'title': str(title), 'notes': str(task_description), 'due': str(due_date)}
        
        # Call the Tasks API
        result = service.tasks().insert(tasklist='OFdHaUVmeW8tdXdoZjJZVQ', body=taskdata).execute()

    except HttpError as err:
        print(err)

    return print('Task Created')

if __name__ == "__main__":
    main()