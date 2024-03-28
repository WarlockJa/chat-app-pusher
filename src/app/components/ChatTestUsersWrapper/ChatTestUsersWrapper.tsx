"use client";
import { useRef, useState } from "react";
import "./chattestuserswrapper.scss";
import Chat from "@/app/components/Chat/Chat";
import { deleteLocalStorage } from "@/util/localStorageRW";
import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import decipherSignature from "@/util/crypto/aes-cbc/decipherSignature";
import apiDB_getChannelOwner from "@/lib/apiDBMethods/apiDB_getChannelOwner";

const USERS: IInitUserId[] = [
  {},
  {
    user_id: "6d17aa1c-9e80-4bc1-82e1-efb37c775bfb",
    user_name: "Registered-User",
    user_admin: false,
  },
  {
    user_id: "6d17aa1c-9e80-4bc1-82e1-efb37c775bfb",
    user_name: "Registered-User",
    user_admin: true,
  },
  {
    user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d1",
    user_name: "Administrator One",
    user_admin: true,
  },
  {
    user_id: "ac7a4918-a3b1-4d87-bdb8-21b77268e6bf",
    user_name: "Administrator Two",
    user_admin: true,
  },
];
export default function ChatTestUsersWrapper() {
  const [currentUser, setCurrentUser] = useState<IInitUserId | null>(null);
  const [value, setValue] = useState({
    option: 0,
    inputs: {
      anononymousUser: false,
      registeredUser: false,
      administrator: false,
    },
  });
  // scrolled user tiles container ref
  const selectWrapperRef = useRef<HTMLDivElement>(null);

  // detecting scrolling between user tiles
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (e.target instanceof HTMLDivElement) {
      // console.log(e.target.scrollWidth, e.target.scrollLeft);

      // first user tile
      if (e.target.scrollLeft < e.target.scrollWidth * 0.01) {
        setValue({ ...value, option: 0 });
        return;
      }

      // second user tile
      if (
        e.target.scrollLeft < e.target.scrollWidth * 0.34 &&
        e.target.scrollLeft > e.target.scrollWidth * 0.32
      ) {
        setValue({
          ...value,
          option: 1,
        });
      }

      // third user tile
      if (e.target.scrollLeft > e.target.scrollWidth * 0.59) {
        setValue({
          ...value,
          option: 2,
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // handling remove localStorage selection
    if (value.option === 0 && value.inputs.anononymousUser)
      deleteLocalStorage({
        storage_uuid: process.env.NEXT_PUBLIC_LOCAL_STORAGE_UUID,
      });

    // selecting user object from USERS according to chose values
    const userIndex =
      value.option === 1
        ? value.inputs.registeredUser
          ? 2
          : 1
        : value.option === 2
        ? value.inputs.administrator
          ? 4
          : 3
        : 0;

    setCurrentUser(USERS[userIndex]);
  };

  let description;
  switch (value.option) {
    case 1:
      description =
        "Registered User. For this user Chat component receives full UserId token with user_id, user_name, and user_admin (false). Registered user is subscribed to a channel, with limited functionality, that can be accessed by an administrator. Registered user's data stored strictly in memory.";
      break;
    case 2:
      description =
        "Administrator. For this user Chat component receives full UserId token with user_id, user_name, and user_admin (true). Administrators have full access to users' chat rooms. Administrator's data stored strictly in memory.";
      break;

    default:
      description =
        "Anonymous User. This option allows for an unregistered user to initiate chat session. For this user Chat component asks for a name and generates random uuid. Anonymous user data persisted in local storage. Anonymous user cannot be an administrator.";
      break;
  }

  return currentUser ? (
    <Chat
      {...currentUser}
      storage_uuid={process.env.NEXT_PUBLIC_LOCAL_STORAGE_UUID!}
      pageLimit={10}
    />
  ) : (
    <>
      {/* TODO delete */}
      {/* <button
        onClick={() => {
          apiDB_getChannelOwner({
            author: "7f6bf857-1f52-40f6-b7c7-399b9b6702d1",
            accessToken: {
              user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d1",
              user_admin: true,
            },
            dispatchKnownUsers: console.log(),
          });
        }}
      >
        TEST
      </button>
      <button
        onClick={() => {
          apiAuth_Authenticate({
            user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d1",
            user_admin: false,
          });
        }}
      >
        Authenticate
      </button> */}
      <form className="chatWrapper" onSubmit={handleSubmit}>
        <h1 className="chatWrapper--header">Support Chat</h1>
        <p>
          This is a testing suite for a Pusher Support Chat component. Utilizing
          Pusher for web sockets events allows this chat to be deployed on a
          serverless hosting that does not support web sockets naturally.
        </p>
        <div className="divider"></div>
        <p>To proceed to the chat select user role</p>
        <div
          className="selectWrapper"
          ref={selectWrapperRef}
          onScroll={handleScroll}
        >
          <div className="scrollBox">
            <div className="selectWrapper__item">
              <button
                className="chatWrapper--submitButton"
                type="submit"
                onMouseOver={() => {
                  setValue({ ...value, option: 0 });
                }}
                onClick={() => {
                  setValue({ ...value, option: 0 });
                }}
              >
                Anonymous User
              </button>
              <div className="selectWrapper__item--confingWrapper">
                <label htmlFor="anonymousUserDelete">
                  Clear previous user data
                </label>
                <input
                  type="checkbox"
                  name="anonymousUserDelete"
                  id="anonymousUserDelete"
                  checked={value.inputs.anononymousUser}
                  onChange={(e) =>
                    setValue({
                      ...value,
                      inputs: {
                        ...value.inputs,
                        anononymousUser: e.target.checked,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="selectWrapper__item">
              <button
                className="chatWrapper--submitButton"
                type="submit"
                onMouseOver={() =>
                  setValue({
                    ...value,
                    option: 1,
                  })
                }
                onClick={() =>
                  setValue({
                    ...value,
                    option: 1,
                  })
                }
              >
                Registered User
              </button>
              <div className="selectWrapper__item--confingWrapper">
                <label htmlFor="registeredUserAdmin">
                  Grant administrator rights
                </label>
                <input
                  type="checkbox"
                  name="registeredUserAdmin"
                  id="registeredUserAdmin"
                  checked={value.inputs.registeredUser}
                  onChange={(e) =>
                    setValue({
                      ...value,
                      inputs: {
                        ...value.inputs,
                        registeredUser: e.target.checked,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="selectWrapper__item">
              <button
                className="chatWrapper--submitButton"
                type="submit"
                onMouseOver={() =>
                  setValue({
                    ...value,
                    option: 2,
                  })
                }
                onClick={() =>
                  setValue({
                    ...value,
                    option: 2,
                  })
                }
              >
                Administrator
              </button>
              <div className="selectWrapper__item--confingWrapper">
                <label htmlFor="administratorNumberTwo">
                  Login as &quot;Administrator Two&quot;
                </label>
                <input
                  type="checkbox"
                  name="administratorNumberTwo"
                  id="administratorNumberTwo"
                  checked={value.inputs.administrator}
                  onChange={(e) =>
                    setValue({
                      ...value,
                      inputs: {
                        ...value.inputs,
                        administrator: e.target.checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <p className={`chatWrapper--description animatedText${value.option}`}>
          {description}
        </p>
      </form>
    </>
  );
}
