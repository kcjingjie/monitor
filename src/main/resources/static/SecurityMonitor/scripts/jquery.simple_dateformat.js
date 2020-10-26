/*!
 * jQuery SimpleDateformat Plugin v1.0.3
 * https://github.com/criticalbreak5/simple_dateformat
 *
 * Copyright 2014 criticalbreak5's
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * Date: 2014-10-06T00:00Z
 */
(
	function($) {
		$.simple_dateformat = function(date, pattern) {
			var buffer = pattern;
			buffer = buffer.split("yyyy").join(padding(4, date.getFullYear()));
			buffer = buffer.split("MM").join(  padding(2, date.getMonth() + 1));
			buffer = buffer.split("dd").join(  padding(2, date.getDate()));
			buffer = buffer.split("HH").join(  padding(2, date.getHours()));
			buffer = buffer.split("mm").join(  padding(2, date.getMinutes()));
			buffer = buffer.split("ss").join(  padding(2, date.getSeconds()));
			buffer = buffer.split("SSS").join( padding(3, date.getMilliseconds()));
			buffer = buffer.split("M").join(date.getMonth() + 1);
			buffer = buffer.split("d").join(date.getDate());
			return buffer;
		};
		function padding(digit, org) {
			var length = String(org).length;
			if (length < digit) {
				for (var i = 0; i < digit - length; i++) {
					org = "0" + org;
				}
			}
			return org;
		};
		$.simple_dateparse = function(datestring, pattern) {
			var y = replace(datestring, pattern, "yyyy", "1970");
			var M = replace(datestring, pattern, "MM",   "1");
			var d = replace(datestring, pattern, "dd",   "1");
			var H = replace(datestring, pattern, "HH",   "0");
			var m = replace(datestring, pattern, "mm",   "0");
			var s = replace(datestring, pattern, "ss",   "0");
			var S = replace(datestring, pattern, "SSS",  "0");
			return new Date(y, M, d, H, m, s, S);
		};
		function replace(datestring, pattern, target, defaultvalue) {
			var position = pattern.indexOf(target);
			if (position == -1) {
				return adjust(target, defaultvalue);
			}
			return adjust(target, datestring.substring(position, (position + target.length)));
		}
		function adjust(target, value) {
			if (target == "MM") {
				return Number(value) - 1;
			} else {
				return Number(value);
			}
		}
})(jQuery);
