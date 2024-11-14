import React from "react";

const SubscriptionHistory = () => {
  const subs_his_list = [
    {
      id: 1,
      subscription_type: "Annual",
      subscription_date: "2024-01-01",
      subscription_amount: "1,599.00",
    },
    {
      id: 2,
      subscription_type: "Annual",
      subscription_date: "2024-01-01",
      subscription_amount: "1,599.00",
    },
    {
      id: 3,
      subscription_type: "Monthly",
      subscription_date: "2024-01-01",
      subscription_amount: "1,599.00",
    },
    {
      id: 4,
      subscription_type: "Annual",
      subscription_date: "2024-01-01",
      subscription_amount: "1,599.00",
    },
  ];
  return (
    <div className="subscription block mt-2 bg-slate-200 rounded-sm">
      <div className=" px-2">
        <div className="flex justify-center py-1">
          <span>Subscription History</span>
        </div>

        <div className="block overflow-y-auto h-[200px] scrollbar">
          <ul>
            {subs_his_list.map((subscription) => (
              <li
                key={subscription.id}
                className="h-[90px] rounded-sm hover:bg-sky-400 hover:ring-sky-500 hover:shadow-md group rounded-md p-3 bg-white ring-1 ring-slate-200 shadow-sm transition duration-500 ease-in-out group"
              >
                <div className="group-hover:text-white">
                  <dd className="font-semibold">
                    {subscription.subscription_type}
                  </dd>
                  <p className="text-sm font-normal">
                    Date: {subscription.subscription_date}
                  </p>
                  <p className="text-sm font-normal">
                    Amount: {subscription.subscription_amount}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHistory;
