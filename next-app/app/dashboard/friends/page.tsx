import FriendList from "./_components/FriendList";
import FriendRequest from "./_components/FriendRequest";
import FriendSearch from "./_components/FriendSearch";


export default function Friends() {
    return (
        <div className="bg-slate-800 h-full grid grid-cols-3 gap-3 overflow-y-auto">
            <div>
                <FriendSearch />
            </div>
            <div>
                <FriendList />
            </div>
            <div>
                <FriendRequest />
            </div>
        </div>
    )
}