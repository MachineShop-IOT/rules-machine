require "base64"
module ApiCalls

  HEADERS = {  
     :authorization => "Basic " + Base64.encode64('VDTzTjFftXeyinJ77RLT' + ':X'),  
     :content_type => :json,  
     :accept => :json  
   }  
#from other sample app api_call.rb  
  STAGE_PLATFORM_API = "http://ec2-23-23-31-170.compute-1.amazonaws.com/api/v0/platform/"

#or try using from other ms api ruby example for GET/rule
  # url = "https://platform.machineshop.io/api/v1/rule?active=true&page=2"  
  # rules_json = RestClient.delete url, headers  

  def get_rules
   platform_request("rule")
  end

  def platform_request(endpoint)
    url = "#{STAGE_PLATFORM_API}#{endpoint}"
    RestClient.get url, HEADERS
  end

end