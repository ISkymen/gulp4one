var site_name = 'https://www.castolin.lndo.site/',
	base_path = '/',
	path = {
		base: base_path,
		styles: {
			dst_dir: base_path + 'css/',
			scss: base_path + 'sass/custom_styles/**/*.scss',
			scss_input: base_path + 'sass/custom_styles.scss'
		},
		js: {
			src: base_path + 'js/custom_js/**/*.js',
			dst_dir: base_path + 'js/',
			dst_file: base_path + 'custom_js.js'
		},
		template: base_path + '**/*.twig'
	};

module.exports = {
    site_name : site_name,
	path : path
};