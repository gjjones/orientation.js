;(function($) {

	var dummyEvent = true;
	var cameraMatrix;

	function calibrateHandler (e) {
    if (dummyEvent) {
      // try again, android first fires dummy event
      dummyEvent = false;
      return;
    };
    var cameraEuler = new THREE.Euler(
      THREE.Math.degToRad(e.gamma),
      THREE.Math.degToRad(e.beta),
      THREE.Math.degToRad(e.alpha));
    cameraMatrix = new THREE.Matrix4();
    cameraMatrix.makeRotationFromEuler(cameraEuler);
    cameraMatrix.getInverse(cameraMatrix);
		$(window).off("deviceorientation", calibrateHandler);
	}
	$.fn.calibrate = function () {
		$(window).on("deviceorientation", calibrateHandler);
	}

	function changeHandler(event) {
		if (!cameraMatrix)
			return;

		event.type = "relativedeviceorientation";

    var calibratedEuler = new THREE.Euler(
      THREE.Math.degToRad(event.gamma),
      THREE.Math.degToRad(event.beta),
      THREE.Math.degToRad(event.alpha));
    calibratedMatrix = new THREE.Matrix4();
    calibratedMatrix.makeRotationFromEuler(calibratedEuler);
    calibratedMatrix.multiplyMatrices(calibratedMatrix, cameraMatrix);

    var finalEuler = new THREE.Euler();
    finalEuler.setFromRotationMatrix(calibratedMatrix);

		event.deltagamma = finalEuler.x;
		event.deltabeta = finalEuler.y;
		event.deltaalpha = finalEuler.z;

		jQuery.event.dispatch.apply(window, arguments);
	}

	$.event.special.relativedeviceorientation = {
		setup: function(data, namespaces)
		{
			$(window).bind("deviceorientation", changeHandler);
		},
		teardown: function(namespaces)
		{
			$(window).unbind("deviceorientation", changeHandler);
		}
	};
})(jQuery);

;(function($) {
	$(window).bind("relativedeviceorientation", function(event) {
		// do something
		alert(event.message);
	});
})(jQuery);
