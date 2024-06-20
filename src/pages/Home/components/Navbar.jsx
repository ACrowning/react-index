import styles from "../app.module.css";
import { Input } from "antd";

export function Navbar({
  searchElement,
  sortByPrice,
  handleSort,
  handleSearch,
}) {
  return (
    <div className={styles.navbar}>
      <div>
        <div className={styles.font}>Filter:</div>
        <Input
          type="text"
          placeholder="Find the title"
          value={searchElement}
          onChange={handleSearch}
        />
      </div>
      <div className={styles.select}>
        Sort by price:
        <select
          value={sortByPrice}
          onChange={handleSort}
          className={styles.select}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
