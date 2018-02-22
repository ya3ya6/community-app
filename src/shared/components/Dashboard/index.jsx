import Announcement from 'containers/Dashboard/Announcement';
import PT from 'prop-types';
import React from 'react';

import CommunityBlog from './CommunityBlog';
import MemberMetrics from './MemberMetrics';
import CurrentActivity from './CurrentActivity';
import Header from './Header';

import './style.scss';

export default function Dashboard({
  achievements,
  achievementsLoading,
  challengeFilter,
  challenges,
  challengesLoading,
  communities,
  communitiesLoading,
  communityStats,
  finances,
  financesLoading,
  selectChallengeDetailsTab,
  setChallengeListingFilter,
  showChallengeFilter,
  showEarnings,
  srms,
  srmsLoading,
  stats,
  statsLoading,
  switchChallengeFilter,
  switchShowChallengeFilter,
  switchShowEarnings,
  switchTab,
  tab,
  tcBlogLoading,
  tcBlogPosts,
  unregisterFromChallenge,
  userGroups,
}) {
  return (
    <div styleName="container">
      <div styleName="page">
        <Header
          achievements={achievements}
          achievementsLoading={achievementsLoading}
        />
        <Announcement />
        <MemberMetrics
          finances={finances}
          financesLoading={financesLoading}
          showEarnings={showEarnings}
          stats={stats}
          statsLoading={statsLoading}
          switchShowEarnings={switchShowEarnings}
        />
        <CurrentActivity
          challengeFilter={challengeFilter}
          challenges={challenges}
          challengesLoading={challengesLoading}
          communities={communities}
          communitiesLoading={communitiesLoading}
          communityStats={communityStats}
          selectChallengeDetailsTab={selectChallengeDetailsTab}
          setChallengeListingFilter={setChallengeListingFilter}
          showChallengeFilter={showChallengeFilter}
          srms={srms}
          srmsLoading={srmsLoading}
          switchChallengeFilter={switchChallengeFilter}
          switchShowChallengeFilter={switchShowChallengeFilter}
          switchTab={switchTab}
          tab={tab}
          unregisterFromChallenge={unregisterFromChallenge}
          userGroups={userGroups}

          // communityList={communityList}
          // stats={stats}
          // groups={profile ? profile.groups : []}
        />
      {/*}
        achievements={achievements} myChallenges={myChallenges.length} />
        <div styleName="my-dashboard-container">
          {
            st.announcementId ? (
              <Announcement id={st.announcementId} />
            ) : null
          }
          <div styleName="challenges">
            {
              loadingActiveChallenges &&
              <LoadingIndicator theme={{}} />
            }
            {
              !loadingActiveChallenges &&
              <MyChallenges
                challenges={myChallenges}
                communityList={communityList}
                stats={stats}
                groups={profile ? profile.groups : []}
              />
            }
          </div>
          <div styleName="srms">
            {
              loadingSRMs &&
              <LoadingIndicator theme={{}} />
            }
            {
              !loadingSRMs &&
              <SRM srms={srms} />
            }
          </div>
          */}
        <CommunityBlog isLoading={tcBlogLoading} posts={tcBlogPosts} />
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  achievements: PT.arrayOf(PT.object).isRequired,
  achievementsLoading: PT.bool.isRequired,
  challengeFilter: PT.string.isRequired,
  challenges: PT.arrayOf(PT.object).isRequired,
  challengesLoading: PT.bool.isRequired,
  communities: PT.arrayOf(PT.object).isRequired,
  communitiesLoading: PT.bool.isRequired,
  communityStats: PT.shape().isRequired,
  finances: PT.arrayOf(PT.object).isRequired,
  financesLoading: PT.bool.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  showChallengeFilter: PT.bool.isRequired,
  showEarnings: PT.bool.isRequired,
  srms: PT.arrayOf(PT.object).isRequired,
  srmsLoading: PT.bool.isRequired,
  stats: PT.shape().isRequired,
  statsLoading: PT.bool.isRequired,
  switchChallengeFilter: PT.func.isRequired,
  switchShowChallengeFilter: PT.func.isRequired,
  switchShowEarnings: PT.func.isRequired,
  switchTab: PT.func.isRequired,
  tab: PT.string.isRequired,
  tcBlogLoading: PT.bool.isRequired,
  tcBlogPosts: PT.arrayOf(PT.object).isRequired,
  unregisterFromChallenge: PT.func.isRequired,
  userGroups: PT.arrayOf(PT.object).isRequired,
};
