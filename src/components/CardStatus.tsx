import styles from './CardStatus.module.css'

function CardStatus({ icone, titulo, valor, cor }: {icone: string, titulo: string, valor: number, cor: string}) {
  return (
    <div className={`col ${styles.statCard} ${styles[cor]}`}>
      <div className={styles.statIconWrapper}>
        <i className={`fas ${icone} ${styles.statIcon}`}></i>
      </div>
      <div className={styles.statInfo}>
        <span className={styles.statTitle}>{titulo}</span>
        <span className={styles.statValue}>{valor}</span>
      </div>
    </div>
  );
}

export default CardStatus;