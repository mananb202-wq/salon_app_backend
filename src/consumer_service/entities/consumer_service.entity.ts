import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn

} from "typeorm";
import {ConsumerCategory} from './consumer_category.entity'

@Entity('ConsumerServices')
export class ConsumerService {
 @PrimaryGeneratedColumn()
  id!: number;

  

  @Column({
    unique: true,
  })
  name!: string;   

@Column('decimal', {
  precision: 10,
  scale: 2,
})
price!: number;

  @Column(
    {
    type: 'time', 
  }
  )
  duration!: string;


@ManyToOne(
  () => ConsumerCategory,
)
@JoinColumn({
  name: 'categoryId',
})
category!: ConsumerCategory;
}
