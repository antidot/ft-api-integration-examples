#!/usr/bin/env python3
import requests
FT_SERVER_URL = '*addPortalURLHere*'

# https://doc.antidot.net/reader/LgsETliZxGWSJkVZdtufoA/0733WXgC0Wz_8phm8GJ1Qw
MAPS_ENDPOINT = '*addMapsEndPoint*'

# https://doc.antidot.net/reader/LgsETliZxGWSJkVZdtufoA/WK_wamoQ2pg4yVBFQiewjQ
HEADERS = {'FT-Authorization': 'Bearer *addYourApiKey*'}

# https://doc.antidot.net/reader/LgsETliZxGWSJkVZdtufoA/0733WXgC0Wz_8phm8GJ1Qw
def crawl_maps():
    URL = FT_SERVER_URL + MAPS_ENDPOINT
    print('Retrieving maps list from {}'.format(URL))
    response = requests.get(URL, headers=HEADERS)
    if response.status_code == 200:
        map_previews = response.json()
        print('> Received {} maps'.format(len(map_previews)))
        for map_preview in map_previews:
            crawl_map(map_preview)
    else:
        print('> {} - {}'.format(response.status_code, response.text))

# https://doc.antidot.net/reader/LgsETliZxGWSJkVZdtufoA/7I5ajWwEd1QKOADIUd2piQ
def crawl_map(map_preview):
    URL = FT_SERVER_URL + map_preview['mapApiEndpoint']
    print('  Retrieving details for map {} from {}'.format(map_preview['id'], URL))
    response = requests.get(URL, headers=HEADERS)
    if response.status_code == 200:
        map_details = response.json()
        print('  > Received details of map {}'.format(map_preview['id']))
        crawl_map_topics(map_details)
    else:
        print('> {} - {}'.format(response.status_code, response.text))

# https://doc.antidot.net/reader/LgsETliZxGWSJkVZdtufoA/yfTGIJxcNBj6e5sJdhjB9g
def crawl_map_topics(map_details):
    URL = FT_SERVER_URL + map_details['topicsApiEndpoint']
    print('    Retrieving topics list for map {} from {}'.format(map_details['id'], URL))
    response = requests.get(URL, headers=HEADERS)
    if response.status_code == 200:
        topic_previews = response.json()
        print('    > Received {} topics for map {}'.format(len(topic_previews), map_details['id']))
        for topic_preview in topic_previews:
            crawl_map_topic(topic_preview)
    else:
        print('> {} - {}'.format(response.status_code, response.text))

# https://doc.antidot.net/reader/LgsETliZxGWSJkVZdtufoA/FPlTdcEhGNGwpvEs_7dxZg
def crawl_map_topic(topic_preview):
    URL = FT_SERVER_URL + topic_preview['contentApiEndpoint']
    print('      Retrieving topic content of {} from {}'.format(topic_preview['id'], URL))
    response = requests.get(URL, headers=HEADERS)
    if response.status_code == 200:
        topic_content = response.text
        print('      > Received topic content of {} ({} chars)'.format(topic_preview['id'], len(topic_content)))
        do_something_with_topic(topic_content)
    else:
        print('> {} - {}'.format(response.status_code, response.text))

def do_something_with_topic(topic_content):
    # pass
    print("Indexing the topic's content...")

if __name__ == '__main__':
    crawl_maps()