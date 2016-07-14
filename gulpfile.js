var gulp = require("gulp");
var pug = require("gulp-pug");
var sass = require("gulp-sass");

gulp.task("compilePug",function()
{
	gulp.src("./*.pug")
		.pipe(pug(
		{
			pretty: true
		}))	
		.pipe(gulp.dest("./"))
});

gulp.task("compileSass",function()
{
	gulp.src("./css/main.sass")
		.pipe(sass(
		{
			outputStyle: "expanded"
		}))
		.pipe(gulp.dest("./css/"))
});

gulp.task("default",function()
{
	gulp.watch("./*.pug",["compilePug"]);
	gulp.watch("./css/main.sass",["compileSass"]);
});