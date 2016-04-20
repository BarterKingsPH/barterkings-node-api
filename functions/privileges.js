exports.checkAdmin = function(req, res, next){
	if (req.session.auth && req.session.userLevel.indexOf('Admin') != -1) {
		return next();
	}else{
		next('User does not have an admin rights.');
	};
}

exports.checkSuperAdmin = function(req, res, next){
	if (req.session.auth && req.session.userLevel.indexOf('Super Admin') != -1) {
		return next();
	}else{
		next('User does not have a super admin rights.');
	};
}

exports.checkUser = function(req, res, next){

	if (req.session.auth && req.session.userLevel.indexOf('User') != -1) {
		return next();
	}else{
		next('No session found.');
	};
}