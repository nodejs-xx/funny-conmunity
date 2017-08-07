var config = require('../config');
var user   = require('../fmdb').user;

exports.new   = newUser; // 新用户
exports.login = login;   // 站内登录
exports.out   = out;     // 退出登录
exports.index = index;   // 显示某人的主页
exports.edit  = edit;    // 修改用户资料
exports.center= center;  // 用户中心
exports.reply = reply;   // 某人的回复

function newUser(req, res, next) {
	var user = req.user;
	user.info = req.session.tempInfo;
	config.title = '注册';
	res.render('./user/new.html', {
		user: user,
		config: config
	});
}

function login(req, res, next) {
	config.title = '登陆';
	res.render('./user/login.html', {user: req.user, config: config});
}

function edit (req, res, next) {
	var user = req.user.info;
	if (user === undefined) return res.redirect('/user/login');

	config.title = '个人资料';
	res.render('./user/edit', {
		user: req.user,
		config: config
	});
}

function index (req, res, next) {
	var option = {
		condition: {},
		sort: {create_date: -1},
		page: req.params.page || 1,
		userInfo: req.user.info,
		name: req.params.name
	};

	user.getUserTopicByName(option, function (err, item) {
		if (err) return next(err);
		config.title = req.params.name;
		res.render('./user/index', {
			user: req.user,
			topic: item.topic,
			user_rank: item.user_rank,
			topic_rank: item.topic_rank,
			count: item.topic_count,
			author: item.topic.author,
			paging: option.page,
			paging_link: '/people/' + item.topic.author.loginname, // 跳转的地址头
			config: config
		})
	});
}

function out (req, res, next) {
	req.session.destroy();
	res.redirect('/');
}

function center (req, res, next) {

	var user = req.user.info;
	if (user === undefined) return res.redirect('/user/login');

	config.title = '个人中心';
	res.render('./user/center', {
		user: req.user,
		config: config
	});
}

function reply (req, res, next) {
	var option = {
		name: req.params.name,
		page: req.params.page || 1
	};
	user.getReplyByName(option, function (err, item) {
		if (err) return next(err);
		res.render('./user/reply', {
			user: req.user,
			config: config,
			user_rank: item.user_rank,
			topic_rank: item.topic_rank,
			reply: item.reply,
			author: item.author,
			count: item.author.reply_count,
			paging: option.page,
			paging_link: '/reply/' + item.author.loginname // 跳转的地址头
		});
	});

}