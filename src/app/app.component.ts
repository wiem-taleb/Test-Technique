import {Component, OnInit} from '@angular/core';
import { FireAuthService } from './services/fire-auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  isSignedIn=false
  
  constructor(
    public fireAuthService: FireAuthService
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('user')!==null)
    this.isSignedIn=true
    else  
    this.isSignedIn=false 
    
  }

  async onSignup(email:string, password:string){
    await this.fireAuthService.signup(email,password)
    if (this.fireAuthService.isLoggedIn)
    this.isSignedIn=true

  }
  async onSignin(email:string, password:string){
    await this.fireAuthService.signin(email,password)
    if (this.fireAuthService.isLoggedIn)
    this.isSignedIn=true
    
  }
  handleLogout(){
    this.isSignedIn=false
    

  }

}
