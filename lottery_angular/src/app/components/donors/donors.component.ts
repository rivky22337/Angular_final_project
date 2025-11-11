import { inject, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Gift } from '../../models/gift.model';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { GiftsService } from '../../services/gifts.service';
import { DonorsService } from '../../services/donors.service';
import { Donor } from '../../models/Donor.model';
import { Router } from '@angular/router';
import { GiftsListComponent } from "../gifts-list/gifts-list.component";
import { CarouselModule } from 'primeng/carousel';
interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-donors',
    standalone: true,
    providers: [MessageService, ConfirmationService],
    imports: [CarouselModule,InputNumberModule, InputTextModule, RatingModule, SelectModule, IconFieldModule, InputIconModule, TagModule, ToastModule, ButtonModule, CommonModule, TableModule, RatingModule, FormsModule, DialogModule, ConfirmDialogModule, FileUploadModule, DropdownModule, CommonModule, ToolbarModule],
    templateUrl: './donors.component.html',
    styleUrl: './donors.component.css',
    styles: [
        `:host ::ng-deep .p-dialog .product-image {
    width: 150px;
    margin: 0 auto 2rem auto;
    display: block;
}`
    ]
})
export class DonorsComponent {
    ngOnInit() {
        this.loadDemoData()
        this.responsiveOptions = [
            {
                breakpoint: '1400px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '1199px',
                numVisible: 3,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '575px',
                numVisible: 1,
                numScroll: 1
            }
        ]
    }


    productDialog: boolean = false;
    responsiveOptions: any[] | undefined;
    giftsService: GiftsService = inject(GiftsService);
    donorsService: DonorsService = inject(DonorsService);
    filteredGifts:Gift[]=[]


    gifts!: Gift[];
    donors!: Donor[];
    donor!: Donor;

    selectedDonors!: Donor[] | null;

    submitted: boolean = false;

    statuses!: any[];
    message: string = ""
    donorsGifts:boolean=false


    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    exportColumns!: ExportColumn[];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cd: ChangeDetectorRef,
        private router:Router
    ) { }
    
    exportCSV() {
        this.dt.exportCSV();
    }

    loadDemoData() {

        this.giftsService.getGifts().subscribe((data) => (this.gifts = data));
        this.donorsService.getDonors().subscribe((data) => (this.donors = data));

        this.cd.markForCheck();

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Gifts Code' },
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Email' },
            { field: 'address', header: 'Address' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    openNew() {
        this.donor = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editDonor(donor: Donor) {
        this.donor = { ...donor };
        this.productDialog = true;
    }


    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteDonor(donor2delete: Donor) {
        this.donor = donor2delete
        const donorsGift=this.gifts.find(g=>g.donor==this.donor.name)
        if(!donorsGift)
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + donor2delete.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.donorsService.delete(donor2delete.id!).subscribe(
                    () => {
                        this.donors = this.donors.filter((val) => val.id !== donor2delete.id);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Donor deleted successfully',
                            life: 3000,
                        });
                    },
                );
            },
        });
        else{
            this.messageService.add({
                severity: 'warn',
                summary: 'Deletion Not Allowed',
                detail: `Cannot delete ${donor2delete.name} because they have associated gifts.`,
                life: 3000,
            });
        }
    }


    saveDonors() {
        this.submitted = true;
        const duplicateDonor = this.donors.find(d => d.name == this.donor.name)
        if (this.donor.name?.trim() && this.donor.email && this.donor.address?.trim()) {
            if (this.donor.id) {
                if (duplicateDonor) {
                    if (duplicateDonor.id != this.donor.id){
                        this.message = "duplicate donor"
                        return
                    }
                }
                    // עדכון תורם קיית
                    this.donorsService.update(this.donor.id, this.donor).subscribe(
                        () => {
                            this.donors = this.donors.map((g) =>
                                g.id === this.donor.id ? g = this.donor : g
                            );
                            this.donors = [...this.donors];
                            this.donor = {};
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Donor updated successfully',
                                life: 3000,
                            });
                        },
                        (error) => {
                            console.error('Error updating donor:', error);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to update donor',
                                life: 3000,
                            });
                        }
                    );                    
                    this.message=""
                    this.productDialog = false;
            } 
            else {
                if (duplicateDonor) {
                    this.message = "duplicate donor"
                }
                else {
                    // הוספת תורם חדשה
                    this.donorsService.add(this.donor).subscribe(
                        (data) => {
                            this.donor.id=data.toString()
                            this.donors.push(this.donor);
                            this.donors = [...this.donors];
                            this.donor = {};
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Gift added successfully',
                                life: 3000,
                            });
                            
                        },
                        (error) => {
                            console.error('Error adding donor:', error);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to add donor',
                                life: 3000,
                            });
                        }
                    );
                    this.message=""
                    this.productDialog = false;
             }
            }
        }

    }
    openDonorsGifts=(donor:Donor)=>{
        this.filteredGifts= this.gifts.filter(g=>g.donor===donor.name)
        this.donorsGifts=true
    }

}
