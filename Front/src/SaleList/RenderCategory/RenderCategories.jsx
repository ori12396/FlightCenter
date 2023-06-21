import { useState, useEffect } from "react"
import RenderCategory from "./RenderCategory"

export default function RenderCategories({categories , func}) {
  const [cat_list, setList] = useState([]);
  useEffect(() => {
    if(categories) {
      const data = categories[1];
      const list = []
      for (let g in data) {
        list.push(data[g]);
      }
      setList(list);
    }
  }, [categories]);
  var sortedList = cat_list.sort((cat_list, b) => cat_list[1].localeCompare(b[1]));
  var renderedCategories = sortedList.map((cat, key) => {
    return <RenderCategory key = {key} category={cat} func={func}/>;
  });
  return renderedCategories;
}