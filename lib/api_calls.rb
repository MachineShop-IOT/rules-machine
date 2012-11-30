require "base64"
require 'json'
module ApiCalls

  HEADERS = {:content_type => :json,
             :accept => :json, 
             :authorization => "Basic " + Base64.encode64('xK37cHcKms4Kjyu3BoEo' + ':X')} #VDTzzjFftXeyinJ77RLT

  STAGE_PLATFORM_API = "http://stage.portal.machineshop.io/api/v0/platform/"
#may need to change if authentication doesn't work

  # def get_reports
  #   platform_request("data/monitor")
  # end

  def get_rules
    platform_request("rule")
  end

  def get_rule(id)
    platform_request("rule/#{id}")
  end

  def get_device_instances
    platform_request("device_instance")
  end

  def get_device(id)
    platform_request("device/#{id}")
  end

  def get_join_rule_conditions
    platform_request("rule/join_rule_conditions")
  end 

  def get_comparison_rule_conditions
    platform_request("rule/comparison_rule_conditions")
  end 

  def create_rule(rule_json)
    url = "#{STAGE_PLATFORM_API}/rule"
    response = RestClient.post url, rule_json, HEADERS
    JSON.parse(response, :symbolize_names => true)
  end

  # def create_rule(rule_json)
  #   url = "#{STAGE_PLATFORM_API}/rule"
  #   JSON.parse(RestClient.post (url, rule_json, HEADERS), :symbolize_names => true)
  # end

  def platform_request(endpoint)
    url = "#{STAGE_PLATFORM_API}#{endpoint}"
    response = RestClient.get url, HEADERS
    JSON.parse(response, :symbolize_names => true)
  end

end