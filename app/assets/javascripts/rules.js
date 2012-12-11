var COMPARISON_CONDITION_TYPES = [['A value is equal to another value.', 'equal_rule_condition'],
                            ['A value is not equal to another value.', 'not_equal_rule_condition'],
                            ['A value is greater than a threshold.', 'greater_than_rule_condition'],
                            ['A value is greater than or equal to a threshold.', 'greater_than_equal_rule_condition'],
                            ['A value is less than a threshold.', 'less_than_rule_condition'],
                            ['A value is less than or equal to a threshold.', 'less_than_equal_rule_condition'],
                            ['A value is one of a collection of values.', 'in_rule_condition'],
                            ['A value is not one of a collection of values.', 'not_in_rule_condition'],
                            ['A position is within a radius of another position.','near_rule_condition'],
                            ['A position is outside a radius of another position.','not_near_rule_condition']];

var JOIN_CONDITION_TYPES = [['A few conditions that must all be true.', 'and_rule_condition'],
                            ['A few conditions where only one must be true.', 'or_rule_condition']];

var ACTION_TYPES = [['Send and email.','email_rule_action'],
                    ['Send a SMS.','sms_rule_action'],
                    ['Send a HTTP request.','http_request_rule_action']];

var condition_counter = 0;
var action_counter = 0;
var panel_names = ['rule_basics','condition_attributes','then_actions','else_actions','confirmation'];
var panel_index = 0;


function ActionNames(array){
  return ConditionNames(array);
}

function ActionTypes(array){
  return ConditionTypes(array);
}

function ConditionNames(array){
  ret = []
  $.each(array, function(key, val){
    ret.push(val[0]);
  });
  return ret;
}

function ConditionTypes(array){
  ret = []
  $.each(array, function(key, val){
    ret.push(val[1]);
  });
  return ret;
}

//Create some helper methods that generate html for various conditions.

function CreateGenericSelect(ary_values, select_id, klass){
  html = $("<select></select>").attr("id",select_id).addClass(klass);
  $.each(ary_values, function(key, value) {
     $(html)
       .append($("<option></option>")
       .attr("value",value)
       .text(value));
  });
  return html;
}

function GetDeviceProperties(device_id){
  devices = $.parseJSON($("#device_properties").val());
  return devices[device_id];
}

function CreateRuleConditionAttributeSelect(device_id, select_id, klass) {
  //for each device_attribute create select options
  return CreateGenericSelect(GetDeviceProperties(device_id), select_id, klass);
}

function CreateConditionSelect(condition_array, select_id, klass){
  text = ConditionNames(condition_array);
  vals = ConditionTypes(condition_array);
  html = $("<select></select>").attr("id",select_id).addClass(klass);
  $.each(text, function(key, value) {
     $(html)
       .append($("<option></option>")
       .attr("value",vals[key])
       .text(value));
  });
  return html;
}

function CreateAllRuleConditionSelect(select_id) {
  combined_array = COMPARISON_CONDITION_TYPES.concat(JOIN_CONDITION_TYPES);
  return CreateConditionSelect(combined_array, select_id, "rule_condition_type");
}

function CreateComparisonRuleConditionSelect(select_id) {
  return CreateConditionSelect(COMPARISON_CONDITION_TYPES, select_id, "comparison_rule_condition_type");
}

function CreateActionSelect(select_id, klass) {
  text = ActionNames(ACTION_TYPES);
  vals = ActionTypes(ACTION_TYPES);
  html = $("<select></select>").attr("id",select_id).addClass(klass);
  $.each(text, function(key, value) {
     $(html)
       .append($("<option></option>")
       .attr("value",vals[key])
       .text(value));
  });
  return html;
}

function CreateSimpleComparisonTextBox(id, klass) {
  return $("<input type='text'></input>").attr("id",id).addClass(klass);
}

function CreateRuleConditionDiv(condition_type, device_id){
  condition_counter++;
  id = "condition_" + condition_counter;

  html = $("<div></div>").attr("id",id).attr("data-condition_type",condition_type).addClass("condition");

  operator = "";
  operator_set = false;

  switch (condition_type){
    case 'equal_rule_condition':
      if (!operator_set){
        operator = " is equal to ";
        operator_set = true;
      }
    case 'not_equal_rule_condition':
      if (!operator_set){
        operator = " is not equal to ";
        operator_set = true;
      }
    case 'greater_than_rule_condition':
      if (!operator_set){
        operator = " is greater than ";
        operator_set = true;
      }
    case 'greater_than_equal_rule_condition':
      if (!operator_set){
        operator = " is greater than or equal to ";
        operator_set = true;
      }
    case 'less_than_rule_condition':
      if (!operator_set){
        operator = " is less than ";
        operator_set = true;
      }
    case 'less_than_equal_rule_condition':
      if (!operator_set){
        operator = " is less than or equal to ";
        operator_set = true;
      }
      //create an attribute dropdown

      html = $(html).append(CreateRuleConditionAttributeSelect(device_id, id + "_property", "property"));
      //add the operator
      html = $(html).append(Line(operator));
      //create a textbox for the comparison value
      html = $(html).append(CreateSimpleComparisonTextBox(id + "_value", "value"));
      break;

    case 'in_rule_condition':
      if (!operator_set){
        operator = " is one of these values ";
        operator_set = true;
      }
    case 'not_in_rule_condition':
      if (!operator_set){
        operator = " is not one of these values ";
        operator_set = true;
      }
      //create an attribute dropdown
      html = $(html).append(CreateRuleConditionAttributeSelect(device_id, id + "_property", "property"));
      html = $(html).append(Line(operator));
      //create a textbox for comma-seperated values to be translated into an array
      html = $(html).append(CreateSimpleComparisonTextBox(id + "_value_array", "value_array"));
      break;

    case 'near_rule_condition':
      if (!operator_set){
        operator = "is within this radius:";
        operator_set = true;
      }
    case 'not_near_rule_condition':
      if (!operator_set){
        operator = "is outside this radius:";
        operator_set = true;
      }
      //create 2 attribute dropdowns to specify lat/long
      html = $(html).append(Line("Payload property for latitude:"));
      html = $(html).append(CreateRuleConditionAttributeSelect(device_id, id + "_lat_property", "lat_property"));
      html = $(html).append(Line("Payload property for longitude:"));
      html = $(html).append(CreateRuleConditionAttributeSelect(device_id, id + "_long_property", "lat_property"));
      //create a textbox for radius
      html = $(html).append(Line(operator));
      html = $(html).append(CreateSimpleComparisonTextBox(id + "_comp_radius", "comp_radius"));

      //create 2 textboxes for reference point
      html = $(html).append(Line("of this latitude:"));
      html = $(html).append(CreateSimpleComparisonTextBox(id + "_comp_lat", "comp_lat"));
      html = $(html).append(Line("and this longitude:"));
      html = $(html).append(CreateSimpleComparisonTextBox(id + "_comp_long", "comp_long"));

      //create a select for units
      html = $(html).append(Line("using these units:"));
      html = $(html).append("<select id='"+id+"_comp_unit' class = 'comp_unit'><option value = 'ft'>Feet</option><option value = 'mi'>Miles</option><option value = 'm'>Meters</option><option value = 'km'>Kilometers</option></select>")
      break;
  }
  return html;
}

function RemoveRuleConditionDiv(id) {
  $("#condition_" + id).remove();
}

function CreateSubconditionDiv(condition_type, device_id){
  html = CreateRuleConditionDiv(condition_type, device_id);
  html = $(html).append("<a href='javascript:void(0)' onclick='RemoveRuleConditionDiv(" + condition_counter + ")'>Remove</a>");

  return html;
}

function CreateSubcondition(condition_type_selector_id, device_id){

  condition_type = $("#" + condition_type_selector_id).val();
  $('.subcondition_adder').remove();
  $("#condition_attributes").append(CreateSubconditionDiv(condition_type, device_id));
  $("#condition_attributes").append(AddSubconditionLink(device_id));

}

function AddSubconditionLink(device_id){
  selector_id = "condition_add_type_" + condition_counter;
  html = $("<div class='subcondition_adder'></div>").append(CreateComparisonRuleConditionSelect(selector_id));
  html = $(html).append("<a href='javascript:void(0)' onclick='CreateSubcondition(\"" + selector_id + "\",\""+ device_id +"\")'>Add this kind of condition</a>");
  return html;
}

function ActionPanel(then_else){
  action_counter++;
  id = "" + then_else + "_" + action_counter;
  cap = then_else.charAt(0).toUpperCase() + then_else.slice(1);

  html = $("<div></div>").attr("id",id).addClass(then_else + "_action");
  html = $(html).append(CreateActionSelect(then_else + "_action_type_" + action_counter, then_else + "_type"));
  html = $(html).append(CreateSimpleComparisonTextBox(then_else + "_action_send_to_" + action_counter, then_else + "_send_to"));
  html = $(html).append("<a href='javascript:void(0)' onclick='RemoveAction(" + id + ")'>Remove</a>");
  return html;
}

function AddActionLink(then_else){
  cap = then_else.charAt(0).toUpperCase() + then_else.slice(1);
  return "<div class='" + then_else + "_adder'><a href='javascript:void(0)' onclick='Create" + cap + "Action()'>Add an action</a></div>";
}

function RemoveAction(id){
  $(id).remove();
}

function CreateThenAction(){
  $('.then_adder').remove();
  $("#then_actions").append(ActionPanel('then'));
  $("#then_actions").append(AddActionLink('then'));
  $('#then_3').remove();
}

function CreateElseAction(){
  $('.else_adder').remove();
  $("#else_actions").append(ActionPanel('else'));
  $("#else_actions").append(AddActionLink('else'));
  $('#else_4').remove();
}

function GetDeviceInstanceType(device_instance_id){
  devices = $.parseJSON($("#device_device_instances").val());
  ret = '';
  $.each(devices, function(key, val){
    $.each(val, function(k,v){
      if (v == device_instance_id){
        ret = key;
      }
    });
  });
  return ret;
}

function DeviceId(){
  device_id = '';
  if ($("input[name='device_selection']:checked").val() == 'rule_devices'){
    device_id = $("#device_ids").val();
  } else {
    device_id = GetDeviceInstanceType($("#device_instance_ids").val());
  }
  return device_id;
}

function Line(line){
  return "<br/>" + line + "<br/>";
 }

 function IsJoinCondition(test_value){
  return ConditionTypes(JOIN_CONDITION_TYPES).indexOf(test_value) != -1
 }

function RuleWizardNext() {
  switch(panel_index){
    case 0:
      condition_type = $("#rule_condition__type").val();
      if (IsJoinCondition(condition_type)){
        $("#condition_attributes").html(AddSubconditionLink(DeviceId()));
      } else {
        $("#condition_attributes").html(CreateRuleConditionDiv(condition_type, DeviceId() ));
      }
      break;
    case 3:
      $("#confirmation").html(Rule());
      $("#rule_json").val(Rule());
      break;
  }
  $("#" + panel_names[panel_index]).hide();
  panel_index++;
  $("#" + panel_names[panel_index]).show();
  EnableWizardButtons();
}

function RuleWizardBack() {
  if (panel_index > 0){
    $("#" + panel_names[panel_index]).hide();
    panel_index--;
    $("#" + panel_names[panel_index]).show();
  }
  EnableWizardButtons();
}

function EnableWizardButtons() {
  switch (panel_index){
    case 0:
      $('.next-btn').show();
      $('.back-btn').hide();
      break;
    case panel_names.length - 1:
      $('.next-btn').hide();
      $('.back-btn').show();
      $('.sbt-btn').show();
      break;
    default:
      $('.next-btn').show();
      $('.back-btn').show();
   }
}

////////////////////////////////////////
//                                    //
//       Create the rule JSON         //
//                                    //
////////////////////////////////////////


///////////  Condition Utility Methods  ////////////////////

function GetConditionNumber(condition_div){
  id = $(condition_div).attr('id');
  return id.split('_')[1];
}

function CreateSimpleComparisonCondition(id_num, condition_type){
  input_id = "#condition_" + id_num;
  property = $(input_id + "_property").val();
  value = $(input_id + "_value").val();
  return '{"type":"'+condition_type+'", "property":"'+property+'", "value":"'+value+'"}';
}

function CreateInComparisonCondition(id_num, condition_type){
  input_id = "#condition_" + id_num;
  property = $(input_id + "_property").val();
  vals = $(input_id + "_value_array").val().split('|');
  value_array = '[';
  $.each(vals, function(k,v){
    if (k != 0){
      value_array += ', ';
    }
    value_array += '"' + v + '"';
  });
  value_array += ']';
  return '{"type":"'+condition_type+'", "property":"'+property+'", "value_array":' + value_array + '}';
}

function CreateNearComparisionCondition(id_num, condition_type){
  input_id = "#condition_" + id_num;
  lat_property = $(input_id + "_lat_property").val();
  long_property = $(input_id + "_long_property").val();
  comp_lat = $(input_id + "_comp_lat").val();
  comp_long = $(input_id + "_comp_long").val();
  comp_radius = $(input_id + "_comp_radius").val();
  comp_unit = $(input_id + "_comp_unit").val();
  return '{"type":"'+condition_type+'", "lat_property":"'+lat_property+'","lng_property":"'+long_property+'","comp_lat":"'+comp_lat+'","comp_lng":"'+comp_long+'","comp_radius":"'+comp_radius+'","comp_unit":"'+comp_unit+'"}';
}

function CreateConditionJson(id_num, condition_type){
  switch (condition_type){
    case 'equal_rule_condition':
    case 'not_equal_rule_condition':
    case 'greater_than_rule_condition':
    case 'greater_than_equal_rule_condition':
    case 'less_than_rule_condition':
    case 'less_than_equal_rule_condition':
      return CreateSimpleComparisonCondition(id_num, condition_type);
      break;

    case 'in_rule_condition':
    case 'not_in_rule_condition':
      return CreateInComparisonCondition(id_num, condition_type)
      break;

    case 'near_rule_condition':
      return CreateNearComparisionCondition(id_num, condition_type)
      break;
  }
}

function CreateSubConditions(){
  conditions_array = '[';
  $.each($('.condition'), function(iter, condition_div){
    id_num = GetConditionNumber(condition_div);
    condition_type = $(condition_div).attr("data-condition_type");
    conditions_array += CreateConditionJson(id_num, condition_type) + ',';
  });
  return conditions_array.slice(0,conditions_array.length-1) + ']';
}

///////////  Action Utility Methods  ////////////////////

function GetActionNumber(action_div){
  id = $(action_div).attr('id');
  return id.split('_')[1];
}

function CreateActionJson(then_else, id_number){
  type = '"type":"' + $('#' + then_else + '_action_type_' + id_number).val() + '"';
  send_to = '"send_to":"' + $('#' + then_else + '_action_send_to_' + id_number).val() + '"';
  return '{ ' + type + ', ' + send_to + ', "priority":"1" }' ;
}

function DeviceOrDeviceInstance(){
  if($("input[name='device_selection']:checked").val() == 'rule_devices') {
    return '"devices":["' + $("#device_ids").val() + '"], "device_instances":[]';
  } else {
    return '"devices":[], "device_instances":["' + $("#device_instance_ids").val() + '"]';
  }
}

////////////  Put the utility methods to work.  ////////////

function RuleCondition(){
  condition = '"condition": ';
  overall_condition_type = $("#rule_condition__type").val();
  if(IsJoinCondition(overall_condition_type)){
    condition += '{ "type":"' + overall_condition_type + '","rule_conditions":';
    condition += CreateSubConditions();
    condition += '}'
  } else {
    id_num = GetConditionNumber($('.condition'));
    condition += CreateConditionJson(id_num, overall_condition_type);
  }
  return condition;
}

function ThenActions() {
  then_actions = '"then_actions": [  ';
  $.each($('.then_action'), function(k,action_div){
    action_number = GetActionNumber(action_div);
    then_actions += CreateActionJson('then', action_number) + ', ';
  });
  then_actions = then_actions.slice(0,then_actions.length-2) + ']';
  return then_actions;
}

function ElseActions() {
  else_actions = '"else_actions": [  ';
  $.each($('.else_action'), function(k,action_div){
    action_number = GetActionNumber(action_div);
    else_actions += CreateActionJson('else', action_number) + ', ';
  });
  else_actions = else_actions.slice(0,else_actions.length-2) + ']';
  return else_actions;
}

function Rule(){
  rule = '{ ' + DeviceOrDeviceInstance() + ', ';
  rule += '"rule": { "description": "' + $("#description").val() + '", ';
  rule += '"active": "true", ';
  rule += RuleCondition() + ', ';
  rule += ThenActions() + ', ';
  rule += ElseActions() + ' } }';
  return rule;
}

////////////////////////////////////////

$(document).ready(function(){
  $.each(panel_names, function(key, value) {
    $("#" + value).hide();
  });

  $("#" + panel_names[0]).show();
  EnableWizardButtons();

  $("#rule_device_instances").hide();
  $("#device_selection").change(function(){
    $("#rule_devices").hide();
    $("#rule_device_instances").hide();
    $("#" + $("input[name='device_selection']:checked").val()).show();
  });

  COMPARISON_CONDITION_TYPES = $.parseJSON($("#comparison_rule_conditions").val());
  JOIN_CONDITION_TYPES = $.parseJSON($("#join_rule_conditions").val());
  $("#rule_condition_selector").html(CreateAllRuleConditionSelect('rule_condition__type'));

  CreateThenAction();
  CreateElseAction();

});
