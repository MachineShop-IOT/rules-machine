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

  # def new
  #   @rule = Rule.new
  #   @rule.rule_condition = RuleCondition.new
  #   @device_instances = DeviceInstance.where(user_id: current_user.id)
  #   device_ids = []
  #   @device_device_instances = {}
  #   @device_instances.each do |di|
  #     device_ids << di.device.id
  #     if @device_device_instances[di.device.id]
  #       @device_device_instances[di.device.id] << di.id
  #     else
  #       @device_device_instances[di.device.id] = [di.id]
  #     end
  #   end
  #   @device_device_instances = @device_device_instances.to_json
  #   @devices = Device.where(:id.in => device_ids)
  #   @device_properties = {}
  #   @devices.each do |device|
  #     device_props = []
  #     device.payloads.each do |payload|
  #       device_props << payload.key_name
  #     end if device.payloads
  #     @device_properties[device.id] = device_props
  #   end
  #   @device_properties = @device_properties.to_json

  #   @comparison_rule_conditions = []
  #   @join_rule_conditions = []
  #   RuleCondition.descendants.each do |condition_type|
  #     if condition_type.description
  #       if JoinCondition.descendants.include? condition_type
  #         @join_rule_conditions << [condition_type.sentence_description, condition_type.name.underscore]
  #       else
  #         @comparison_rule_conditions << [condition_type.sentence_description, condition_type.name.underscore]
  #       end
  #     end
  #   end
  #   @comparison_rule_conditions = @comparison_rule_conditions.to_json
  #   @join_rule_conditions = @join_rule_conditions.to_json

  def new
    #call GET/device_instance endpoint
    @device_instances = get_device_instances
    @device_ids = []
    @device_ids_all = []
    @device_device_instances = {}
    @device_instances.each do |di|
      @device_ids_all << di[:device_id]
      @device_device_instances[di[:device_id]] = di[:_id]
    end
    @device_ids = @device_ids_all.uniq if @device_ids_all.length > 0
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
    redirect_to rules_path
  end
end
