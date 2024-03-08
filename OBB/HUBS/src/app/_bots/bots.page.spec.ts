import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { BotsPage } from './bots.page';

describe('BotsPage', () => {
  let component: BotsPage;
  let fixture: ComponentFixture<BotsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BotsPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BotsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
