import { useUiStore } from "@/store";
import { MessageCircle } from "lucide-react";
import LogoutButton from "../common/LogoutButton";
function Profile() {
    const { setSideView } = useUiStore();
  return (
    <div className="p-6 h-screen">
      <div className="h-full overflow-hidden rounded-3xl shadow-lg bg-brandCream-50 border border-brandChoco-50/20">
        {/* Profile Container */}
        <div className="h-full p-4 flex-shrink-0 flex flex-col">
          {/* Profile Header */}
          <div className="flex items-center justify-between px-4 pb-4 border-b border-brandChoco-50/20">
            <h2 className="text-3xl font-bold text-brandChoco-50">Profile</h2>
            <div className="flex text-brandChoco-50 shadow-inner p-2 rounded-full hover:bg-brandChoco-50 hover:text-white transition-all duration-200 cursor-pointer" onClick={() => setSideView("Conversation")}>
                <MessageCircle />
            </div>
          </div>

          {/* Profile Content */}
          <div className="flex-1 mt-6 overflow-y-auto scrollbar-thin scrollbar-thumb-brandChoco-100/30 scrollbar-track-transparent pr-2">
            {/* Profile Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="flex items-center justify-center h-32 w-32 rounded-full text-white bg-brandChoco-100 shadow-inner mb-4 text-4xl font-bold">
                  ฟหกด
                </div>
                <button className="absolute bottom-2 right-2 bg-brandChoco-50 text-white p-2 rounded-full shadow-lg hover:bg-brandChoco-100 transition-all duration-200">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <form className="space-y-4 px-4">
              {/* Personal Information */}
              <div className="bg-white/70 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-brandChoco-50 mb-4">
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brandChoco-100 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-brandChoco-50/20 bg-white/80 
                           focus:outline-none focus:ring-2 focus:ring-brandChoco-100 focus:border-transparent
                           text-brandChoco-50 placeholder-brandChoco-100/50 transition-all duration-200"
                      placeholder="Enter your full name"
                      defaultValue=""
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brandChoco-100 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-brandChoco-50/20 bg-white/80 
                           focus:outline-none focus:ring-2 focus:ring-brandChoco-100 focus:border-transparent
                           text-brandChoco-50 placeholder-brandChoco-100/50 transition-all duration-200"
                      placeholder="your.email@example.com"
                      defaultValue=""
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brandChoco-100 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border border-brandChoco-50/20 bg-white/80 
                           focus:outline-none focus:ring-2 focus:ring-brandChoco-100 focus:border-transparent
                           text-brandChoco-50 placeholder-brandChoco-100/50 transition-all duration-200"
                      placeholder="+66 xx xxx xxxx"
                      defaultValue=""
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brandChoco-100 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-brandChoco-50/20 bg-white/80 
                           focus:outline-none focus:ring-2 focus:ring-brandChoco-100 focus:border-transparent
                           text-brandChoco-50 placeholder-brandChoco-100/50 transition-all duration-200 resize-none"
                      placeholder="Tell us something about yourself..."
                      defaultValue=""
                    />
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-white/70 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-brandChoco-50 mb-4">
                  Account Settings
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-brandChoco-50 font-medium">
                        Email Notifications
                      </p>
                      <p className="text-sm text-brandChoco-100/80">
                        Receive notifications via email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div
                        className="w-11 h-6 bg-brandChoco-100/30 peer-focus:outline-none rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
                                peer-checked:bg-brandChoco-100"
                      ></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-brandChoco-50 font-medium">
                        Push Notifications
                      </p>
                      <p className="text-sm text-brandChoco-100/80">
                        Receive push notifications
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div
                        className="w-11 h-6 bg-brandChoco-100/30 peer-focus:outline-none rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
                                peer-checked:bg-brandChoco-100"
                      ></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-brandChoco-50 font-medium">
                        Online Status
                      </p>
                      <p className="text-sm text-brandChoco-100/80">
                        Show when you're online
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div
                        className="w-11 h-6 bg-brandChoco-100/30 peer-focus:outline-none rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
                                peer-checked:bg-brandChoco-100"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-white/70 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-brandChoco-50 mb-4">
                  Security
                </h3>

                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-brandChoco-50/20 
                         bg-white/50 hover:bg-brandCream-200 transition-all duration-200 text-left"
                  >
                    <div>
                      <p className="text-brandChoco-50 font-medium">
                        Change Password
                      </p>
                      <p className="text-sm text-brandChoco-100/80">
                        Update your password
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-brandChoco-100"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-brandChoco-50/20 
                         bg-white/50 hover:bg-brandCream-200 transition-all duration-200 text-left"
                  >
                    <div>
                      <p className="text-brandChoco-50 font-medium">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-brandChoco-100/80">
                        Add extra security to your account
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-brandChoco-100"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 justify-center">
                <LogoutButton />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
