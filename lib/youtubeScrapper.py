from bs4 import BeautifulSoup as BS
import requests,sys,json

def read_in():
    lines = sys.stdin.readlines()
    # converting the input line to json format.
    return json.loads(lines[0])

def send_request( url ):
	return requests.get(url).text

def process_search_request( response ):

	video_list = []
	# use BeautifulSoup to parse the response HTML page.
	parsed_response = BS(response, "html.parser")
	# get the ordered list of search results.
	search_results = parsed_response.find('div', {'id':'results'}).find('ol',{'class':'item-section'})
	# get all the search results from the list.
	result_contents = search_results.find_all('div',{'class':'yt-lockup-content'})
	# parse through all the results.
	for result in result_contents:
		try:
			video = create_video(result)
			#print json.dumps(video)
			video_list.append(json.dumps(video))
		except:
			"Unable to parse. Might contain some non parsable characters."
	print json.dumps(video_list)


def create_video( result ):
	video = {}
	# get the info from the header tag.	
	duration = result.h3.span.text.split(": ")
	video['duration'] = duration[1].split(".")[0]
	video['link'] = result.h3.a['href']
	video['title'] = result.h3.a['title']

	# get info from other divs.
	publisher_info = result.find('div',{'class':'yt-lockup-byline'})
	video['publisherLink'] = publisher_info.a['href']
	video['publishedBy'] = publisher_info.a.text

	# get info metadata info from other div.
	meta_info = result.find('div',{'class':'yt-lockup-meta'}).find_all('li')
	video['meta_info_age'] = meta_info[0].text
	video['meta_info_views'] = meta_info[1].text
	return video

# def get_best_result(video_list) {
# 	for video in video_list:

# }


def main():

    # getting input from the stdin.
    input = read_in()
    url = 'https://www.youtube.com'
    search_url = url +'/results?search_query='+input['search_query']
    
    #r = requests.get(search_url)
    r = send_request(search_url)

    #result = BS(r.text, "html.parser")
    process_search_request(r)
    

# Start process
if __name__ == '__main__':
    main()