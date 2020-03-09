import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/user.model';
import { NgForm } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr'
import { pwnedPassword } from 'hibp';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css']
})
export class SingUpComponent implements OnInit {
  user: User;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  submitted = false;

  constructor(private userService: UserService, private toastr: ToastrService) { }

  ngOnInit() {
    this.resetForm();

    this.toastr.info('If no password is chosen, 1 will be designated.', 'Remark!', {timeOut: 10000})    
  }

  resetForm(form?: NgForm) {
    if (form != null){
      this.submitted = false;
      form.reset();
    }
    this.user = {
      UserName: '',
      Password: '',
      confirmPassword: '',
      Email: '',
      FirstName: '',
      LastName: ''
    }
  }

  OnSubmit(form: NgForm) {
    if(form.value.Password !== "" && form.value.Password !== null){
      if(form.value.Password !== form.value.confirmPassword){
        this.toastr.error('Confirmation password does not match password!');
        return false;
      }else if(form.value.Password !== '' && form.value.Password.length < 8 && this.submitted === false){
        this.toastr.error('Password must be longer than 8 digits!');
        return false;
      }}else if(form.value.Password === "" || form.value.Password === null && form.value.confirmPassword === "" || form.value.confirmPassword === null && form.value.UserName !== ""){
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        form.value.Password = result;
        form.value.confirmPassword = result;
        alert('User will be created with following info if unique username\n\n' + JSON.stringify(form.value, null, 4));
      }

      this.submitted = true;

      pwnedPassword(form.value.Password)
    .then(numPwns =>{
      if (numPwns) {
        this.toastr.error('Password has been breached ' + numPwns +' times!');
        return false;
      }else{
        this.userService.registerUser(form.value)
        .subscribe((data: any) => {
          if (data.Succeeded == true) {
            this.resetForm(form);
            this.toastr.success('User registration successful');
          }
          else{
            for (var e in data.Errors) 
            {  
              this.toastr.error(data.Errors[e]);
            }  
            this.resetForm(form);
          }
        });
      }});
  }
}