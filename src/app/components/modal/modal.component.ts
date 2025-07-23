import {Component,Input,Output,EventEmitter,Injector,inject,CUSTOM_ELEMENTS_SCHEMA,Optional} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule,NgComponentOutlet,  } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    NgComponentOutlet 
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
})
export class ModalComponent  {
  @Input() title?: string;
  @Input() confirmAction: string = '';
  @Input() cancelAction: string = '';
  @Input() customValidation: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() loadingConfirmationMethod: boolean = false;
  @Input() hideConfirmAction: boolean = false;
  @Input() useCustomBackGround: boolean = false;
  @Input() hideCancelOption: boolean = false;
  @Input() hideFooter: boolean = false;
  @Input() modalBodyClass: string = 'modal-body';
  @Input() modalFooterClass: string = 'modal-footer';
  @Input() modalContentClass: string = 'modal-content';

  @Output() callCancelMethod = new EventEmitter();
  @Output() callConfirmationMethod = new EventEmitter();

  @Input() bodyComponent: any;
  @Input() bodyInput: any;

  public modalService: NgbModal = inject(NgbModal);

  public hide() {
    this.modalService.dismissAll();
  }

  public hideModal() {
    this.hide();
    this.callCancelMethod.emit();
  }

  createInjector(): Injector {
    return Injector.create({
      providers: [
        { provide: 'formData', useValue: this.bodyInput },
        { provide: 'onSubmit', useValue: this.callConfirmationMethod }
      ]
    });
  }
}
