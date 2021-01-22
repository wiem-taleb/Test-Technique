import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FireAuthService } from '../services/fire-auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FireBaseService, IEmployee} from '../services/fire-base.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Output() isLogout=new EventEmitter<void>()

  public form: FormGroup;

  public employeeList: IEmployee[] = [];
  public employeeDetails: IEmployee;
  constructor(public fireAuthService:FireAuthService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private fireBaseService: FireBaseService
    ) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  logout(){
  this.fireAuthService.logout()
  this.isLogout.emit()
  }



  getEmployees(): void {
    this.fireBaseService.getEmployees().subscribe((res) => {
      this.employeeList = res.map((employee) => {
        return {
          ...employee.payload.doc.data(),
          id: employee.payload.doc.id
        } as IEmployee;
      });
    });
  }

  openModal(content: TemplateRef<any>, employeeId: string): void {
    this.employeeDetails = this.employeeList.find((employee: IEmployee) => employee.id === employeeId);

    this.formInit(this.employeeDetails);
    this.modalService.open(content, {backdrop: 'static', centered: true});
  }

  formInit(data: IEmployee): void {
    this.form = this.fb.group({
      name: [data ? data.name : '', Validators.required],
      email: [data ? data.email : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ])
      ]
    });
  }

  addEmployee(): void {
    this.fireBaseService.addEmployee(this.form.value).then();
  }

  updateEmployee(employeeId: string): void {
    this.fireBaseService.updateEmployee(employeeId, this.form.value).then();
  }

  deleteEmployee(employeeId: string): void {
    this.fireBaseService.deleteEmployee(employeeId).then();
  }
}
