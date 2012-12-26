define(['jquery'], function ($) {

	var bless = function (parentClass, className, classDef) {
		if (2 == arguments.length) {
			classDef = arguments[1];
			className = arguments[0];
			parentClass = undefined;
		}
		//provide a default constructor if none was defined
		if (!classDef.hasOwnProperty('constructor')) {
			if (parentClass) {
				classDef.constructor = function () {
					this._super.apply(this, arguments);
				};
			} else {
				classDef.constructor = function () {
				};
			}
		}
		var clazz = {};
		if (parentClass) {
			$.extend(clazz, parentClass.prototype);
			$.each(classDef, function (key, attr) {
				if (key in clazz) {
					attr._super = clazz[key];
				}
				clazz[key] = attr;
			});
			//IE skips the constructor attribute so we explicitly wire it up here
			classDef.constructor._super = parentClass.prototype.constructor;
			clazz.constructor = classDef.constructor;
			clazz._super = function () {
				return arguments.callee.caller._super.apply(this, arguments);
			};
		} else {
			clazz = classDef;
		}
		classDef.constructor.prototype = clazz;
		classDef.constructor._name = className;
		return classDef.constructor;
	};

	return {
		bless: bless
	};

});