// Generated by CoffeeScript 1.9.2
(function() {
  var Bar_Chart, root,
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Bar_Chart = (function() {
    function Bar_Chart(sample_list1) {
      var longest_sample_name, sample;
      this.sample_list = sample_list1;
      this.sort_by = "name";
      this.get_samples();
      console.log("sample names:", this.sample_names);
      if (this.sample_attr_vals.length > 0) {
        this.get_distinct_attr_vals();
        this.get_attr_color_dict(this.distinct_attr_vals);
      }
      longest_sample_name = d3.max((function() {
        var j, len, ref, results;
        ref = this.sample_names;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          sample = ref[j];
          results.push(sample.length);
        }
        return results;
      }).call(this));
      this.margin = {
        top: 20,
        right: 20,
        bottom: longest_sample_name * 7,
        left: 40
      };
      this.plot_width = this.sample_vals.length * 20 - this.margin.left - this.margin.right;
      this.range = this.sample_vals.length * 20;
      this.plot_height = 500 - this.margin.top - this.margin.bottom;
      this.x_buffer = this.plot_width / 20;
      this.y_buffer = this.plot_height / 20;
      this.y_min = d3.min(this.sample_vals);
      this.y_max = d3.max(this.sample_vals) * 1.1;
      this.svg = this.create_svg();
      this.plot_height -= this.y_buffer;
      this.create_scales();
      this.create_graph();
      d3.select("#color_attribute").on("change", (function(_this) {
        return function() {
          _this.attribute = $("#color_attribute").val();
          console.log("attr_color_dict:", _this.attr_color_dict);
          if (_this.sort_by = "name") {
            _this.svg.selectAll(".bar").data(_this.sorted_samples()).transition().duration(1000).style("fill", function(d) {
              if (_this.attribute === "None") {
                return "steelblue";
              } else {
                return _this.attr_color_dict[_this.attribute][d[2][_this.attribute]];
              }
            }).select("title").text(function(d) {
              return d[1];
            });
          } else {
            _this.svg.selectAll(".bar").data(_this.samples).transition().duration(1000).style("fill", function(d) {
              if (_this.attribute === "None") {
                return "steelblue";
              } else {
                return _this.attr_color_dict[_this.attribute][d[2][_this.attribute]];
              }
            });
          }
          _this.draw_legend();
          return _this.add_legend(_this.attribute, _this.distinct_attr_vals[_this.attribute]);
        };
      })(this));
      $(".sort_by_value").on("click", (function(_this) {
        return function() {
          console.log("sorting by value");
          _this.sort_by = "value";
          if (_this.attributes.length > 0) {
            _this.attribute = $("#color_attribute").val();
          }
          return _this.rebuild_bar_graph(_this.sorted_samples());
        };
      })(this));
      $(".sort_by_name").on("click", (function(_this) {
        return function() {
          console.log("sorting by name");
          _this.sort_by = "name";
          if (_this.attributes.length > 0) {
            _this.attribute = $("#color_attribute").val();
          }
          return _this.rebuild_bar_graph(_this.samples);
        };
      })(this));
      d3.select("#color_by_trait").on("click", (function(_this) {
        return function() {
          return _this.open_trait_selection();
        };
      })(this));
    }

    Bar_Chart.prototype.redraw = function(samples_dict) {
      var attr, j, len, name, ref, ref1, updated_samples, val, x;
      updated_samples = [];
      ref = this.full_sample_list;
      for (j = 0, len = ref.length; j < len; j++) {
        ref1 = ref[j], name = ref1[0], val = ref1[1], attr = ref1[2];
        if (name in samples_dict) {
          updated_samples.push([name, samples_dict[name], attr]);
        }
      }
      this.samples = updated_samples;
      this.sample_names = (function() {
        var k, len1, ref2, results;
        ref2 = this.samples;
        results = [];
        for (k = 0, len1 = ref2.length; k < len1; k++) {
          x = ref2[k];
          results.push(x[0]);
        }
        return results;
      }).call(this);
      this.sample_vals = (function() {
        var k, len1, ref2, results;
        ref2 = this.samples;
        results = [];
        for (k = 0, len1 = ref2.length; k < len1; k++) {
          x = ref2[k];
          results.push(x[1]);
        }
        return results;
      }).call(this);
      this.sample_attr_vals = (function() {
        var k, len1, ref2, results;
        ref2 = this.samples;
        results = [];
        for (k = 0, len1 = ref2.length; k < len1; k++) {
          x = ref2[k];
          results.push(x[2]);
        }
        return results;
      }).call(this);
      return this.rebuild_bar_graph(this.sort_by === 'name' ? this.samples : this.sorted_samples());
    };

    Bar_Chart.prototype.rebuild_bar_graph = function(samples) {
      console.log("samples:", samples);
      this.svg.selectAll(".bar").data(samples).transition().duration(1000).style("fill", (function(_this) {
        return function(d) {
          if (_this.attributes.length === 0 && (_this.trait_color_dict != null)) {
            console.log("SAMPLE:", d[0]);
            console.log("CHECKING:", _this.trait_color_dict[d[0]]);
            return _this.trait_color_dict[d[0]];
          } else if (_this.attributes.length > 0 && _this.attribute !== "None") {
            console.log("@attribute:", _this.attribute);
            console.log("d[2]", d[2]);
            console.log("the_color:", _this.attr_color_dict[_this.attribute][d[2][_this.attribute]]);
            return _this.attr_color_dict[_this.attribute][d[2][_this.attribute]];
          } else {
            return "steelblue";
          }
        };
      })(this)).attr("y", (function(_this) {
        return function(d) {
          return _this.y_scale(d[1]);
        };
      })(this)).attr("height", (function(_this) {
        return function(d) {
          return _this.plot_height - _this.y_scale(d[1]);
        };
      })(this)).select("title").text((function(_this) {
        return function(d) {
          return d[1];
        };
      })(this));
      this.create_scales();
      $('.bar_chart').find('.x.axis').remove();
      $('.bar_chart').find('.y.axis').remove();
      this.add_x_axis();
      return this.add_y_axis();
    };

    Bar_Chart.prototype.get_attr_color_dict = function(vals) {
      var color, color_range, distinct_vals, i, j, k, key, len, len1, results, this_color_dict, value;
      this.attr_color_dict = {};
      console.log("vals:", vals);
      results = [];
      for (key in vals) {
        if (!hasProp.call(vals, key)) continue;
        distinct_vals = vals[key];
        this.min_val = d3.min(distinct_vals);
        this.max_val = d3.max(distinct_vals);
        this_color_dict = {};
        if (distinct_vals.length < 10) {
          color = d3.scale.category10();
          for (i = j = 0, len = distinct_vals.length; j < len; i = ++j) {
            value = distinct_vals[i];
            this_color_dict[value] = color(i);
          }
        } else {
          console.log("distinct_values:", distinct_vals);
          if (_.every(distinct_vals, (function(_this) {
            return function(d) {
              if (isNaN(d)) {
                return false;
              } else {
                return true;
              }
            };
          })(this))) {
            color_range = d3.scale.linear().domain([min_val, max_val]).range([0, 255]);
            for (i = k = 0, len1 = distinct_vals.length; k < len1; i = ++k) {
              value = distinct_vals[i];
              console.log("color_range(value):", parseInt(color_range(value)));
              this_color_dict[value] = d3.rgb(parseInt(color_range(value)), 0, 0);
            }
          }
        }
        results.push(this.attr_color_dict[key] = this_color_dict);
      }
      return results;
    };

    Bar_Chart.prototype.draw_legend = function() {
      var svg_html;
      $('#legend-left').html(this.min_val);
      $('#legend-right').html(this.max_val);
      svg_html = '<svg height="10" width="90"> <rect x="0" width="15" height="10" style="fill: rgb(0, 0, 0);"></rect> <rect x="15" width="15" height="10" style="fill: rgb(50, 0, 0);"></rect> <rect x="30" width="15" height="10" style="fill: rgb(100, 0, 0);"></rect> <rect x="45" width="15" height="10" style="fill: rgb(150, 0, 0);"></rect> <rect x="60" width="15" height="10" style="fill: rgb(200, 0, 0);"></rect> <rect x="75" width="15" height="10" style="fill: rgb(255, 0, 0);"></rect> </svg>';
      console.log("svg_html:", svg_html);
      return $('#legend-colors').html(svg_html);
    };

    Bar_Chart.prototype.get_trait_color_dict = function(samples, vals) {
      var color, color_range, distinct_vals, i, j, k, key, len, len1, results, sample, this_color_dict, value;
      this.trait_color_dict = {};
      console.log("vals:", vals);
      for (key in vals) {
        if (!hasProp.call(vals, key)) continue;
        distinct_vals = vals[key];
        this_color_dict = {};
        this.min_val = d3.min(distinct_vals);
        this.max_val = d3.max(distinct_vals);
        if (distinct_vals.length < 10) {
          color = d3.scale.category10();
          for (i = j = 0, len = distinct_vals.length; j < len; i = ++j) {
            value = distinct_vals[i];
            this_color_dict[value] = color(i);
          }
        } else {
          console.log("distinct_values:", distinct_vals);
          if (_.every(distinct_vals, (function(_this) {
            return function(d) {
              if (isNaN(d)) {
                return false;
              } else {
                return true;
              }
            };
          })(this))) {
            color_range = d3.scale.linear().domain([d3.min(distinct_vals), d3.max(distinct_vals)]).range([0, 255]);
            for (i = k = 0, len1 = distinct_vals.length; k < len1; i = ++k) {
              value = distinct_vals[i];
              console.log("color_range(value):", parseInt(color_range(value)));
              this_color_dict[value] = d3.rgb(parseInt(color_range(value)), 0, 0);
            }
          }
        }
      }
      results = [];
      for (sample in samples) {
        if (!hasProp.call(samples, sample)) continue;
        value = samples[sample];
        results.push(this.trait_color_dict[sample] = this_color_dict[value]);
      }
      return results;
    };

    Bar_Chart.prototype.convert_into_colors = function(values) {
      var color_range, i, j, len, results, value;
      color_range = d3.scale.linear().domain([d3.min(values), d3.max(values)]).range([0, 255]);
      results = [];
      for (i = j = 0, len = values.length; j < len; i = ++j) {
        value = values[i];
        console.log("color_range(value):", color_range(parseInt(value)));
        results.push(this_color_dict[value] = d3.rgb(color_range(parseInt(value)), 0, 0));
      }
      return results;
    };

    Bar_Chart.prototype.get_samples = function() {
      var attr_vals, attribute, j, k, key, len, len1, ref, ref1, sample;
      this.sample_names = (function() {
        var j, len, ref, results;
        ref = this.sample_list;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          sample = ref[j];
          if (sample.value !== null) {
            results.push(sample.name);
          }
        }
        return results;
      }).call(this);
      this.sample_vals = (function() {
        var j, len, ref, results;
        ref = this.sample_list;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          sample = ref[j];
          if (sample.value !== null) {
            results.push(sample.value);
          }
        }
        return results;
      }).call(this);
      this.attributes = (function() {
        var results;
        results = [];
        for (key in this.sample_list[0]["extra_attributes"]) {
          results.push(key);
        }
        return results;
      }).call(this);
      console.log("attributes:", this.attributes);
      this.sample_attr_vals = [];
      if (this.attributes.length > 0) {
        ref = this.sample_list;
        for (j = 0, len = ref.length; j < len; j++) {
          sample = ref[j];
          attr_vals = {};
          ref1 = this.attributes;
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            attribute = ref1[k];
            attr_vals[attribute] = sample["extra_attributes"][attribute];
          }
          this.sample_attr_vals.push(attr_vals);
        }
      }
      this.samples = _.zip(this.sample_names, this.sample_vals, this.sample_attr_vals);
      return this.full_sample_list = this.samples.slice();
    };

    Bar_Chart.prototype.get_distinct_attr_vals = function() {
      var attribute, j, len, ref, results, sample;
      this.distinct_attr_vals = {};
      ref = this.sample_attr_vals;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        sample = ref[j];
        results.push((function() {
          var ref1, results1;
          results1 = [];
          for (attribute in sample) {
            if (!this.distinct_attr_vals[attribute]) {
              this.distinct_attr_vals[attribute] = [];
            }
            if (ref1 = sample[attribute], indexOf.call(this.distinct_attr_vals[attribute], ref1) < 0) {
              results1.push(this.distinct_attr_vals[attribute].push(sample[attribute]));
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    Bar_Chart.prototype.create_svg = function() {
      var svg;
      svg = d3.select("#bar_chart").append("svg").attr("class", "bar_chart").attr("width", this.plot_width + this.margin.left + this.margin.right).attr("height", this.plot_height + this.margin.top + this.margin.bottom).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      return svg;
    };

    Bar_Chart.prototype.create_scales = function() {
      this.x_scale = d3.scale.ordinal().domain(this.sample_names).rangeRoundBands([0, this.range], 0.1, 0);
      return this.y_scale = d3.scale.linear().domain([this.y_min * 0.75, this.y_max]).range([this.plot_height, this.y_buffer]);
    };

    Bar_Chart.prototype.create_graph = function() {
      this.add_x_axis();
      this.add_y_axis();
      return this.add_bars();
    };

    Bar_Chart.prototype.add_x_axis = function(scale) {
      var xAxis;
      xAxis = d3.svg.axis().scale(this.x_scale).orient("bottom");
      return this.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + this.plot_height + ")").call(xAxis).selectAll("text").style("text-anchor", "end").style("font-size", "12px").attr("dx", "-.8em").attr("dy", "-.3em").attr("transform", (function(_this) {
        return function(d) {
          return "rotate(-90)";
        };
      })(this));
    };

    Bar_Chart.prototype.add_y_axis = function() {
      var yAxis;
      yAxis = d3.svg.axis().scale(this.y_scale).orient("left").ticks(5);
      return this.svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end");
    };

    Bar_Chart.prototype.add_bars = function() {
      return this.svg.selectAll(".bar").data(this.samples).enter().append("rect").style("fill", "steelblue").attr("class", "bar").attr("x", (function(_this) {
        return function(d) {
          return _this.x_scale(d[0]);
        };
      })(this)).attr("width", this.x_scale.rangeBand()).attr("y", (function(_this) {
        return function(d) {
          return _this.y_scale(d[1]);
        };
      })(this)).attr("height", (function(_this) {
        return function(d) {
          return _this.plot_height - _this.y_scale(d[1]);
        };
      })(this)).append("svg:title").text((function(_this) {
        return function(d) {
          return d[1];
        };
      })(this));
    };

    Bar_Chart.prototype.sorted_samples = function() {
      var sample_list, sorted;
      sample_list = _.zip(this.sample_names, this.sample_vals, this.sample_attr_vals);
      sorted = _.sortBy(sample_list, (function(_this) {
        return function(sample) {
          return sample[1];
        };
      })(this));
      console.log("sorted:", sorted);
      return sorted;
    };

    Bar_Chart.prototype.add_legend = function(attribute, distinct_vals) {
      var legend, legend_rect, legend_text;
      legend = this.svg.append("g").attr("class", "legend").attr("height", 100).attr("width", 100).attr('transform', 'translate(-20,50)');
      legend_rect = legend.selectAll('rect').data(distinct_vals).enter().append("rect").attr("x", this.plot_width - 65).attr("width", 10).attr("height", 10).attr("y", (function(_this) {
        return function(d, i) {
          return i * 20;
        };
      })(this)).style("fill", (function(_this) {
        return function(d) {
          console.log("TEST:", _this.attr_color_dict[attribute][d]);
          return _this.attr_color_dict[attribute][d];
        };
      })(this));
      return legend_text = legend.selectAll('text').data(distinct_vals).enter().append("text").attr("x", this.plot_width - 52).attr("y", (function(_this) {
        return function(d, i) {
          return i * 20 + 9;
        };
      })(this)).text((function(_this) {
        return function(d) {
          return d;
        };
      })(this));
    };

    Bar_Chart.prototype.open_trait_selection = function() {
      return $('#collections_holder').load('/collections/list?color_by_trait #collections_list', (function(_this) {
        return function() {
          $.colorbox({
            inline: true,
            href: "#collections_holder"
          });
          return $('a.collection_name').attr('onClick', 'return false');
        };
      })(this));
    };

    Bar_Chart.prototype.color_by_trait = function(trait_sample_data) {
      var distinct_values, trimmed_samples;
      console.log("BXD1:", trait_sample_data["BXD1"]);
      console.log("trait_sample_data:", trait_sample_data);
      trimmed_samples = this.trim_values(trait_sample_data);
      distinct_values = {};
      distinct_values["collection_trait"] = this.get_distinct_values(trimmed_samples);
      this.get_trait_color_dict(trimmed_samples, distinct_values);
      console.log("TRAIT_COLOR_DICT:", this.trait_color_dict);
      console.log("SAMPLES:", this.samples);
      if (this.sort_by = "value") {
        this.svg.selectAll(".bar").data(this.samples).transition().duration(1000).style("fill", (function(_this) {
          return function(d) {
            console.log("this color:", _this.trait_color_dict[d[0]]);
            return _this.trait_color_dict[d[0]];
          };
        })(this)).select("title").text((function(_this) {
          return function(d) {
            return d[1];
          };
        })(this));
        return this.draw_legend();
      } else {
        this.svg.selectAll(".bar").data(this.sorted_samples()).transition().duration(1000).style("fill", (function(_this) {
          return function(d) {
            console.log("this color:", _this.trait_color_dict[d[0]]);
            return _this.trait_color_dict[d[0]];
          };
        })(this)).select("title").text((function(_this) {
          return function(d) {
            return d[1];
          };
        })(this));
        return this.draw_legend();
      }
    };

    Bar_Chart.prototype.trim_values = function(trait_sample_data) {
      var j, len, ref, sample, trimmed_samples;
      trimmed_samples = {};
      ref = this.sample_names;
      for (j = 0, len = ref.length; j < len; j++) {
        sample = ref[j];
        if (sample in trait_sample_data) {
          trimmed_samples[sample] = trait_sample_data[sample];
        }
      }
      console.log("trimmed_samples:", trimmed_samples);
      return trimmed_samples;
    };

    Bar_Chart.prototype.get_distinct_values = function(samples) {
      var distinct_values;
      distinct_values = _.uniq(_.values(samples));
      console.log("distinct_values:", distinct_values);
      return distinct_values;
    };

    return Bar_Chart;

  })();

  root.Bar_Chart = Bar_Chart;

}).call(this);
