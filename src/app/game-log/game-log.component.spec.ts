import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLogComponent } from './game-log.component';

describe('ResultsComponent', () => {
  let component: GameLogComponent;
  let fixture: ComponentFixture<GameLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
