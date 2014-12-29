// Generated by CoffeeScript 1.8.0
var add_trait_data, assemble_into_json, back_to_collections, collection_click, collection_list, color_by_trait, get_this_trait_vals, get_trait_data, process_traits, selected_traits, submit_click, this_trait_data, trait_click,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

console.log("before get_traits_from_collection");

collection_list = null;

this_trait_data = null;

selected_traits = {};

collection_click = function() {
  var this_collection_url;
  console.log("Clicking on:", $(this));
  this_collection_url = $(this).find('.collection_name').prop("href");
  this_collection_url += "&json";
  console.log("this_collection_url", this_collection_url);
  collection_list = $("#collections_holder").html();
  return $.ajax({
    dataType: "json",
    url: this_collection_url,
    success: process_traits
  });
};

submit_click = function() {
  var all_vals, sample, samples, this_trait_vals, trait, trait_names, traits, _i, _j, _len, _len1, _ref;
  selected_traits = {};
  traits = [];
  $('#collections_holder').find('input[type=checkbox]:checked').each(function() {
    var this_dataset, this_trait, this_trait_url;
    this_trait = $(this).parents('tr').find('.trait').text();
    console.log("this_trait is:", this_trait);
    this_dataset = $(this).parents('tr').find('.dataset').text();
    console.log("this_dataset is:", this_dataset);
    this_trait_url = "/trait/get_sample_data?trait=" + this_trait + "&dataset=" + this_dataset;
    return $.ajax({
      dataType: "json",
      url: this_trait_url,
      async: false,
      success: add_trait_data
    });
  });
  console.log("SELECTED_TRAITS IS:", selected_traits);
  trait_names = [];
  samples = $('input[name=allsamples]').val().split(" ");
  all_vals = [];
  this_trait_vals = get_this_trait_vals(samples);
  all_vals.push(this_trait_vals);
  _ref = Object.keys(selected_traits);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    trait = _ref[_i];
    trait_names.push(trait);
    this_trait_vals = [];
    for (_j = 0, _len1 = samples.length; _j < _len1; _j++) {
      sample = samples[_j];
      if (__indexOf.call(Object.keys(selected_traits[trait]), sample) >= 0) {
        this_trait_vals.push(parseFloat(selected_traits[trait][sample]));
      } else {
        this_trait_vals.push(null);
      }
    }
    all_vals.push(this_trait_vals);
  }
  create_scatterplots(trait_names, samples, all_vals);
  return $.colorbox.close();
};

trait_click = function() {
  var dataset, this_trait_url, trait;
  console.log("Clicking on:", $(this));
  trait = $(this).parent().find('.trait').text();
  dataset = $(this).parent().find('.dataset').text();
  this_trait_url = "/trait/get_sample_data?trait=" + trait + "&dataset=" + dataset;
  console.log("this_trait_url", this_trait_url);
  $.ajax({
    dataType: "json",
    url: this_trait_url,
    success: get_trait_data
  });
  return $.colorbox.close();
};

add_trait_data = function(trait_data, textStatus, jqXHR) {
  var trait_name, trait_sample_data;
  trait_name = trait_data[0];
  trait_sample_data = trait_data[1];
  selected_traits[trait_name] = trait_sample_data;
  return console.log("selected_traits:", selected_traits);
};

get_trait_data = function(trait_data, textStatus, jqXHR) {
  var sample, samples, this_trait_vals, trait_sample_data, vals, _i, _len;
  console.log("trait:", trait_data[0]);
  trait_sample_data = trait_data[1];
  console.log("trait_sample_data:", trait_sample_data);
  samples = $('input[name=allsamples]').val().split(" ");
  vals = [];
  for (_i = 0, _len = samples.length; _i < _len; _i++) {
    sample = samples[_i];
    if (__indexOf.call(Object.keys(trait_sample_data), sample) >= 0) {
      vals.push(parseFloat(trait_sample_data[sample]));
    } else {
      vals.push(null);
    }
  }
  if ($('input[name=samples]').length < 1) {
    $('#hidden_inputs').append('<input type="hidden" name="samples" value="[' + samples.toString() + ']" />');
  }
  $('#hidden_inputs').append('<input type="hidden" name="vals" value="[' + vals.toString() + ']" />');
  this_trait_vals = get_this_trait_vals(samples);
  console.log("THE LENGTH IS:", $('input[name=vals]').length);
  return color_by_trait(trait_sample_data);
};

get_this_trait_vals = function(samples) {
  var sample, this_trait_vals, this_val, this_vals_json, _i, _len;
  this_trait_vals = [];
  for (_i = 0, _len = samples.length; _i < _len; _i++) {
    sample = samples[_i];
    this_val = parseFloat($("input[name='value:" + sample + "']").val());
    if (!isNaN(this_val)) {
      this_trait_vals.push(this_val);
    } else {
      this_trait_vals.push(null);
    }
  }
  console.log("this_trait_vals:", this_trait_vals);
  this_vals_json = '[' + this_trait_vals.toString() + ']';
  return this_trait_vals;
};

assemble_into_json = function(this_trait_vals) {
  var json_data, json_ids, num_traits, samples;
  num_traits = $('input[name=vals]').length;
  samples = $('input[name=samples]').val();
  json_ids = samples;
  json_data = '[' + this_trait_vals;
  $('input[name=vals]').each((function(_this) {
    return function(index, element) {
      return json_data += ',' + $(element).val();
    };
  })(this));
  json_data += ']';
  return [json_ids, json_data];
};

color_by_trait = function(trait_sample_data, textStatus, jqXHR) {
  console.log('in color_by_trait:', trait_sample_data);
  return root.bar_chart.color_by_trait(trait_sample_data);
};

process_traits = function(trait_data, textStatus, jqXHR) {
  var the_html, trait, _i, _len;
  console.log('in process_traits with trait_data:', trait_data);
  the_html = "<button id='back_to_collections' class='btn btn-inverse btn-small'>";
  the_html += "<i class='icon-white icon-arrow-left'></i> Back </button>";
  the_html += "    <button id='submit' class='btn btn-primary btn-small'> Submit </button>";
  the_html += "<table class='table table-hover'>";
  the_html += "<thead><tr><th></th><th>Record</th><th>Data Set</th><th>Description</th><th>Mean</th></tr></thead>";
  the_html += "<tbody>";
  for (_i = 0, _len = trait_data.length; _i < _len; _i++) {
    trait = trait_data[_i];
    the_html += "<tr class='trait_line'>";
    the_html += "<td class='select_trait'><input type='checkbox' name='selectCheck' class='checkbox edit_sample_checkbox'></td>";
    the_html += "<td class='trait'>" + trait.name + "</td>";
    the_html += "<td class='dataset'>" + trait.dataset + "</td>";
    the_html += "<td>" + trait.description + "</td>";
    the_html += "<td>" + (trait.mean || '&nbsp;') + "</td></tr>";
  }
  the_html += "</tbody>";
  the_html += "</table>";
  $("#collections_holder").html(the_html);
  return $('#collections_holder').colorbox.resize();
};

back_to_collections = function() {
  console.log("collection_list:", collection_list);
  $("#collections_holder").html(collection_list);
  $(document).on("click", ".collection_line", collection_click);
  return $('#collections_holder').colorbox.resize();
};

$(function() {
  console.log("inside get_traits_from_collection");
  $(document).on("click", ".collection_line", collection_click);
  $(document).on("click", "#submit", submit_click);
  $(document).on("click", ".trait", trait_click);
  return $(document).on("click", "#back_to_collections", back_to_collections);
});