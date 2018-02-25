

exports = module.exports = function() {return this;};

/*
*
* 通过访问路径生成打包路径
*
* */

var outPath = "./build/";
var accentPathPre = "..";

exports.getBulidPath = function(accentPath,accentPathPretemp){

	//代码生成路径
	
 accentPathPretemp = accentPathPretemp||accentPathPre
	//工具包到跟目录的访问路径，用于解析代码中的路径
	return (outPath + (accentPath||"").replace(accentPathPretemp,"")).toURI();
}

/*
*
* 从跟目录到访问目录
*
* */
exports.getAccentPath = function (rootPath){

	//工具包到跟目录的访问路径，用于解析代码中的路径
	
	return (accentPathPre + rootPath).toURI();
}

/*
 *
 * 从访问目录到跟目录
 *
 * */
exports.getRootPath = function (rootPath){

	//工具包到跟目录的访问路径，用于解析代码中的路径

	return (rootPath.replace(accentPathPre,"")).toURI();
}
/*
*
* 执行操作
*
* */

exports.init = function(setOutPath){

	outPath = setOutPath;

}
