require "base64"
require 'api_calls.rb'
class RulesController < ApplicationController
  include ApiCalls

  # GET /rules
  # GET /rules.json
  # before_filter :init_admin_info

  def index
    #   @rules = Rule.where(user_id: current_user.id)
    @rules = get_rules

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @rules }
    end
  end

  # GET /rules/1
  # GET /rules/1.json
  def show
    @rule = get_rule(params[:id])
  end

  # For each class variable, substitute each model name with API endpoint
  def new
    @device_instances = get_device_instances #call GET/device_instance endpoint DeviceInstance.where(user_id: current_user.id)
    @device_ids = []
    @device_device_instances = {}
    @device_instances.each do |di|
      @device_ids << di[:device_id]
      if @device_device_instances[di[:device_id]]
        @device_device_instances[di[:device_id]] << di[:_id]
      else
        @device_device_instances[di[:device_id]] = di[:_id]
      end
    end
    @device_device_instances = @device_device_instances.to_json
    @devices = [] #Device.where(:id.in => device_ids)
    @device_ids.each do |id|
      @devices << get_device(id) #DOES THIS RETURN device.payloads?? ##Changed device to @devices
    end
    #get all device payloads (called properties) DOES THIS WORK???
    @device_properties = {}
    @devices.each do |device| #@device?
      device_props = []
      device[:payloads].each do |payload|
        device_props << payload[:key_name]
      end if device[:payloads]
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
    @rule = create_rule(params[:rule_json]) #(JSON.parse(params[:rule_json])) #changed from,(params[:rule_json])
    # if @rule
    redirect_to rules_path
    # else
    #   render action: 'new'
    # end
  end
end

#   # PUT /rules/1
#   # PUT /rules/1.json
#   def update
#     # Put code here to turn the params into a hash that gets turned
#     # into JSON and passed to the POST /rule platform endpoint.
#     # @rule = Rule.find(params[:id])
#     # @rule.actions.build({ send_to: params[:send_to] }, params[:action_type])

#     if @rule.update_attributes(params[:rule])
#       redirect_to rules_path
#     else
#       render action: 'edit'
#     end
#   end

#   # DELETE /rules/1
#   # DELETE /rules/1.json
#   def destroy
#     @rule = Rule.find(params[:id])
#     @rule.destroy
#     redirect_to rules_path
#   end

#   def deactivate
#     @rule = Rule.find(params[:id])
#     @rule.deactivate
#     respond_to do |format|
#       format.html {redirect_to :back}
#       format.js
#     end
#   end

#   def reactivate
#     @rule = Rule.find(params[:id])
#     @rule.activate
#     respond_to do |format|
#       format.html {redirect_to :back}
#       format.js { render json: @rules }
#     end
#   end

#   def init_admin_info
#     @total_api_calls = ApiActivity.where(user_id: current_user.id.to_s).count
#     @di_arr = []
#     @alert_count = 0
#     current_user.device_instances.each do |di|
#       # For the top panel
#       @di_arr.push di.id
#       di.update_alert_summary
#       @alert_count += di.alert_count
#     end
#     @total_report_count = Report.any_in(device_instance_id: @di_arr).count
#   end
# end
