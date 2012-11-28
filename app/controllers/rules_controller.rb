require 'api_calls.rb'

class RulesController < ApplicationController
	include ApiCalls

def index
  @rules = JSON.parse(get_rules)
  
  respond_to do |format|
  format.html
  format.json { render json: @rules }
	end
end

end