import cloudsight

auth = cloudsight.SimpleAuth(Ybhk7asHqrKITGjBIs275w)
api = cloudsight.API(auth)

with open('your-file.jpg', 'rb') as f:
    response = api.image_request(f, 'your-file.jpg', {
        'image_request[locale]': 'en-US',
    })

    status = api.image_response(response['token'])
if status['status'] != cloudsight.STATUS_NOT_COMPLETED:
    # Done!
    pass

status = api.wait(response['token'], timeout=30)
