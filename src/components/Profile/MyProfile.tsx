import { useState } from "react"
import { FiLogOut } from "react-icons/fi"
import Button from "../Button/Button"
import type { ProfileUser } from "../../types"

interface MyProfileProps {
  userData: ProfileUser
  onLogout: () => void
}

function MyProfile({ userData, onLogout }: MyProfileProps) {
  const [username, setUsername] = useState(userData.username)

  const initials = userData.username.substring(0, 2)

  return (
    <div className="my-profile">
      <div className="my-profile__header">
        <div className="my-profile__avatar">
          <span className="my-profile__avatar__initials">{initials}</span>
        </div>
        <h2 className="my-profile__username">{userData.username}</h2>
      </div>

      <div className="my-profile__fields">
        <div className="form__fields__group">
          <label htmlFor="username" className="form__fields__group__label my-profile__label">Username</label>
          <input
            type="text"
            id="username"
            className="form__fields__group__input my-profile__input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form__fields__group">
          <label htmlFor="email" className="form__fields__group__label my-profile__label">Email</label>
          <input
            type="text"
            id="email"
            className="form__fields__group__input my-profile__input"
            value={userData.email}
            readOnly
          />
        </div>
      </div>

      <div className="my-profile__actions">
        <Button variant="primary" onClick={() => {}}>
          Reset password
        </Button>
        <Button variant="logout" onClick={onLogout}>
          <FiLogOut />
          Log out
        </Button>
      </div>
    </div>
  )
}

export default MyProfile
