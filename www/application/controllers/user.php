<?php

class User extends Controller {

	function __construct() {
		parent::Controller();

		//$this->output->enable_profiler(TRUE);      

	}
	        
	function index() {
		redirect('user/login');
	}


	
	function login() {

			if($this->input->post('login')) {
				$this->session->login($this->input->post('user_name'), md5($this->input->post('user_secret')));
				redirect('');
			}

			$view['page_menu_code'] = 'user/logout';
			$view['page_content'] = $this->load->view('user_login_view', $view, True);
			$this->load->view('main_page_view', $view);

	}



	function logout() {
		$this->session->logout();
		redirect('');
	}

}

?>
