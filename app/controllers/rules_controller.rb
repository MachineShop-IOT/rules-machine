require "base64"
require 'api_calls.rb'
class RulesController < ApplicationController
  include ApiCalls

  def index
    @rules = get_rules

    respond_to do |format|
      format.html
      format.json { render json: @rules }
    end
  end

  def show
    @rule = get_rule(params[:id])
  end

  def new
    #call GET/device_instance endpoint 
    @device_instances = get_device_instances 
    @device_ids_all = []
    @device_device_instances = {}
    @device_instances.each do |di|
      @device_ids_all << di[:device_id]
      @device_ids = @device_ids_all.uniq
      @device_device_instances[di[:device_id]] = di[:_id]
    end
    @device_device_instances = @device_device_instances.to_json

    #call GET/device endpoint 
    @devices = [] 
    @device_ids.each do |id|
      @devices << get_device(id) 
    end

    #get all device payloads
    @device_properties = {}
    @devices.each do |device|
      device[:payloads] = [] if !device[:payloads]
      device_props = []
      device[:payloads].each do |payload|
        device_props << payload[:key_name]
        end if @device_properties[device[:_id]] = device_props
        @device_properties[device[:id]] = device_props 
    end
     @device_properties = @device_properties.to_json 

    # Call endpoint to retrieve all possible rule conditions
    @join_rule_conditions = get_join_rule_conditions.to_json
    @comparison_rule_conditions = get_comparison_rule_conditions.to_json

    respond_to do |format|
      format.html
      format.json { render json: @rule }
    end
  end

  def create
    rule = create_rule(params[:rule_json]) 
    if rule
    redirect_to rules_path
    else
      render action: 'new'
    end
  end

  def destroy
    @rule = delete_rule(params[:id])
    @rule.destroy
    redirect_to rules_path
  end

### Another attempt at delete
#   def destroy
#     # @rule = delete_rule(params[:id])
#     @rule = get_rule(params[:id])
#     delete_rule(@rule[:_id])
#      redirect_to rules_path
#   end
end