import { Link } from "react-router"
import type { Tag as TagType } from "../../types"

interface TagProps {
  tag: TagType
}

function Tag({ tag }: TagProps) {
  return (
    <>
      <div className="tag">
        <Link to={`/tag/${tag.id}`} className="tag__name">
          {tag.displayName}
        </Link>
      </div>
    </>
  )
}

export default Tag