/**
 * Container for the dashboard page.
 */
/* global location */

import _ from 'lodash';
import challengeActions from 'actions/challenge';
import cookies from 'browser-cookies';
import Dashboard from 'components/Dashboard';
import dashActions from 'actions/page/dashboard';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import config from 'utils/config';
import memberActions from 'actions/members';
import PT from 'prop-types';
import React from 'react';
import rssActions from 'actions/rss';
import shortId from 'shortid';

import { connect } from 'react-redux';
import { BUCKETS } from 'utils/challenge-listing/buckets';

import challengeListingActions from 'actions/challenge-listing';
import communityActions from 'actions/tc-communities';
import moment from 'moment';
import statsActions from 'actions/stats';
import { processActiveDevDesignChallenges } from 'utils/tc';
import Header from 'components/Dashboard/Header';
// import MyChallenges from 'components/Dashboard/MyChallenges';
import SRM from 'components/Dashboard/SRM';
import Program from 'components/Dashboard/Program';
import LoadingIndicator from 'components/LoadingIndicator';

import { isTokenExpired } from 'tc-accounts';
import { cdnService } from 'services/contentful-cms';
import { isClientSide } from 'utils/isomorphy';

import './styles.scss';

/* When mounted, this container triggers (re-)loading of various data it needs.
 * It will not reload any data already present in the Redux store, if they were
 * fetched more recently than this max age [ms]. */
const CACHE_MAX_AGE = 10 * 60 * 1000;

/* Constants for loading Topcoder blog. */
const TOPCODER_BLOG_ID = 'TOPCODER_BLOG';
const TOPOCDER_BLOG_URL = `/community-app-assets/api/proxy-get?url=${
  encodeURIComponent(config.URL.BLOG_FEED)}`;

export class DashboardPageContainer extends React.Component {
  componentDidMount() {
    const {
      achievementsLoading,
      achievementsTimestamp,
      activeChallengesLoading,
      activeChallengesTimestamp,
      challengeFilter,
      communitiesLoading,
      communitiesTimestamp,
      financesLoading,
      financesTimestamp,
      getAllActiveChallenges,
      getCommunityList,
      getMemberAchievements,
      getMemberFinances,
      getMemberStats,
      getSrms,
      getTopcoderBlogFeed,
      handle,
      profile,
      srmsLoading,
      srmsTimestamp,
      statsLoading,
      statsTimestamp,
      switchChallengeFilter,
      tcBlogLoading,
      tcBlogTimestamp,
      tokenV3,
    } = this.props;
    if (!this.authCheck(tokenV3)) return;

    const now = Date.now();

    if (now - achievementsTimestamp > CACHE_MAX_AGE
    && !achievementsLoading) getMemberAchievements(handle);

    if (now - activeChallengesTimestamp > CACHE_MAX_AGE
    && !activeChallengesLoading) getAllActiveChallenges(tokenV3);

    if (now - communitiesTimestamp > CACHE_MAX_AGE
    && !communitiesLoading) getCommunityList({ profile, tokenV3 });

    if (now - financesTimestamp > CACHE_MAX_AGE
    && !financesLoading) getMemberFinances(handle, tokenV3);

    if (now - srmsTimestamp > CACHE_MAX_AGE
    && !srmsLoading) getSrms(handle, tokenV3);

    if (now - statsTimestamp > CACHE_MAX_AGE
    && !statsLoading) getMemberStats(handle, tokenV3);

    if (now - tcBlogTimestamp > CACHE_MAX_AGE
    && !tcBlogLoading) getTopcoderBlogFeed();

    if (now - communitiesTimestamp < CACHE_MAX_AGE
    && now - activeChallengesTimestamp < CACHE_MAX_AGE) {
      this.updateCommunityStats(this.props);
    }

    if (challengeFilter) switchChallengeFilter('');
  }

  componentWillReceiveProps(nextProps) {
    this.authCheck(nextProps.tokenV3);

    const now = Date.now();
    if (now - nextProps.communitiesTimestamp < CACHE_MAX_AGE
    && now - nextProps.activeChallengesTimestamp < CACHE_MAX_AGE) {
      this.updateCommunityStats(nextProps);
    }
  }

  /**
   * Does nothing if a valid TC API v3 token is passed in; otherwise redirects
   * user to the TC auth page, with proper return URL.
   * @param {String} tokenV3
   * @return {Boolean} `true` if the user is authenticated; `false` otherwise.
   */
  authCheck(tokenV3) {
    if (tokenV3 && !isTokenExpired(tokenV3)) return true;

    /* This implements front-end redirection. Once the server-side rendering of
     * the Dashboard is in place, this should be updated to work for the server
     * side rendering as well. */
    let url = `retUrl=${encodeURIComponent(location.href)}`;
    url = `${config.URL.AUTH}/member?${url}&utm_source=community-app-main`;
    location.href = url;

    _.noop(this);
    return false;
  }

  updateCommunityStats(props) {
    const {
      activeChallenges,
      communities,
      communityStats,
      getCommunityStats,
      tokenV3,
    } = props;
    const now = Date.now();
    communities.forEach((community) => {
      const stats = communityStats[community.communityId];
      if (stats && (stats.loadingUuid
      || now - (stats.timestamp || 0) < CACHE_MAX_AGE)) return;
      getCommunityStats(community, activeChallenges, tokenV3);
    });
    _.noop(this.props.getCommunityStats);
  }

  render() {
    const {
      achievements,
      achievementsLoading,
      activeChallenges,
      activeChallengesLoading,
      challengeFilter,
      communities,
      communitiesLoading,
      communityStats,
      finances,
      financesLoading,
      handle,
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
      tokenV2,
      tokenV3,
      unregisterFromChallenge,
      userGroups,
    } = this.props;

    return (
      <Dashboard
        achievements={achievements}
        achievementsLoading={achievementsLoading}
        challengeFilter={challengeFilter}
        challenges={activeChallenges.filter(x => x.users[handle])}
        challengesLoading={activeChallengesLoading}
        communities={communities}
        communitiesLoading={communitiesLoading}
        communityStats={communityStats}
        finances={finances}
        financesLoading={financesLoading}
        selectChallengeDetailsTab={selectChallengeDetailsTab}
        setChallengeListingFilter={setChallengeListingFilter}
        showChallengeFilter={showChallengeFilter}
        showEarnings={showEarnings}
        srms={srms}
        srmsLoading={srmsLoading}
        stats={stats}
        statsLoading={statsLoading}
        switchChallengeFilter={switchChallengeFilter}
        switchShowChallengeFilter={switchShowChallengeFilter}
        switchShowEarnings={switchShowEarnings}
        switchTab={switchTab}
        tab={tab}
        tcBlogLoading={tcBlogLoading}
        tcBlogPosts={tcBlogPosts}
        unregisterFromChallenge={id =>
          unregisterFromChallenge({ tokenV2, tokenV3 }, id)}
        userGroups={userGroups.map(x => x.id)}
      />
    );
  }
}

DashboardPageContainer.defaultProps = {
  achievements: [],
  achievementsTimestamp: 0,
  finances: [],
  financesTimestamp: 0,
  handle: '',
  profile: null,
  showEarnings:
    isClientSide() ? cookies.get('showEarningsInDashboard') !== 'false' : true,
  stats: {},
  statsTimestamp: 0,
  tcBlogPosts: [],
  tcBlogTimestamp: 0,
  tokenV2: null,
  tokenV3: null,
};

DashboardPageContainer.propTypes = {
  achievements: PT.arrayOf(PT.object),
  achievementsLoading: PT.bool.isRequired,
  achievementsTimestamp: PT.number,
  activeChallenges: PT.arrayOf(PT.object).isRequired,
  activeChallengesLoading: PT.bool.isRequired,
  activeChallengesTimestamp: PT.number.isRequired,
  challengeFilter: PT.string.isRequired,
  communities: PT.arrayOf(PT.object).isRequired,
  communitiesLoading: PT.bool.isRequired,
  communityStats: PT.shape().isRequired,
  communitiesTimestamp: PT.number.isRequired,
  finances: PT.arrayOf(PT.object),
  financesLoading: PT.bool.isRequired,
  financesTimestamp: PT.number,
  getAllActiveChallenges: PT.func.isRequired,
  getCommunityList: PT.func.isRequired,
  getCommunityStats: PT.func.isRequired,
  getMemberAchievements: PT.func.isRequired,
  getMemberFinances: PT.func.isRequired,
  getMemberStats: PT.func.isRequired,
  getSrms: PT.func.isRequired,
  getTopcoderBlogFeed: PT.func.isRequired,
  handle: PT.string,
  profile: PT.shape(),
  selectChallengeDetailsTab: PT.func.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  showChallengeFilter: PT.bool.isRequired,
  showEarnings: PT.bool,
  srms: PT.arrayOf(PT.object).isRequired,
  srmsLoading: PT.bool.isRequired,
  srmsTimestamp: PT.number.isRequired,
  stats: PT.shape(),
  statsLoading: PT.bool.isRequired,
  statsTimestamp: PT.number,
  switchChallengeFilter: PT.func.isRequired,
  switchShowChallengeFilter: PT.func.isRequired,
  switchShowEarnings: PT.func.isRequired,
  switchTab: PT.func.isRequired,
  tab: PT.string.isRequired,
  tcBlogLoading: PT.bool.isRequired,
  tcBlogPosts: PT.arrayOf(PT.object),
  tcBlogTimestamp: PT.number,
  tokenV2: PT.string,
  tokenV3: PT.string,
  unregisterFromChallenge: PT.func.isRequired,
  userGroups: PT.arrayOf(PT.object).isRequired,
};

function mapStateToProps(state) {
  const communities = state.tcCommunities.list;

  const userHandle = _.get(state.auth, 'user.handle');
  const member = state.members[userHandle] || {};
  const achievements = member.achievements || {};
  const finances = member.finances || {};
  const stats = member.stats || {};

  const dash = state.page.dashboard;

  const tcBlog = state.rss[TOPCODER_BLOG_ID] || {};
  return {
    achievements: achievements.data,
    achievementsLoading: Boolean(achievements.loadingUuid),
    achievementsTimestamp: achievements.timestamp,
    activeChallenges: state.challengeListing.challenges,
    activeChallengesLoading:
      Boolean(state.challengeListing.loadingActiveChallengesUUID),
    activeChallengesTimestamp:
      state.challengeListing.lastUpdateOfActiveChallenges,
    challengeFilter: dash.challengeFilter,
    communities: communities.data,
    communitiesLoading: Boolean(communities.loadingUuid),
    communitiesTimestamp: communities.timestamp,
    communityStats: state.stats.communities,
    finances: finances.data,
    financesLoading: Boolean(finances.loadingUuid),
    financesTimestamp: finances.timestamp,
    handle: userHandle,
    profile: state.auth.profile,
    showChallengeFilter: dash.showChallengeFilter,
    showEarnings: dash.showEarnings,
    srms: state.challengeListing.srms.data,
    srmsLoading: Boolean(state.challengeListing.srms.loadingUuid),
    srmsTimestamp: state.challengeListing.srms.timestamp,
    stats: stats.data,
    statsLoading: Boolean(stats.loadingUuid),
    statsTimestamp: stats.timestamp,
    tab: dash.tab,
    tcBlogLoading: Boolean(tcBlog.loadingUuid),
    tcBlogPosts: _.get(tcBlog, 'data.item'),
    tcBlogTimestamp: tcBlog.timestamp,
    tokenV2: state.auth.tokenV2,
    tokenV3: state.auth.tokenV3,
    userGroups: _.get(state.auth.profile, 'groups', []),
  };
}

function mapDispatchToProps(dispatch) {
  const dash = dashActions.page.dashboard;
  const members = memberActions.members;
  return {
    getAllActiveChallenges: (tokenV3) => {
      const uuid = shortId();
      dispatch(challengeListingActions.challengeListing.getAllActiveChallengesInit(uuid));
      dispatch(challengeListingActions.challengeListing.getAllActiveChallengesDone(uuid, tokenV3));
    },
    getCommunityList: (auth) => {
      const uuid = shortId();
      dispatch(communityActions.tcCommunity.getListInit(uuid));
      dispatch(communityActions.tcCommunity.getListDone(uuid, auth));
    },
    getCommunityStats: (community, challenges, token) => {
      const uuid = shortId();
      const a = statsActions.stats;
      dispatch(a.getCommunityStatsInit(community, uuid));
      dispatch(a.getCommunityStatsDone(community, uuid, challenges, token));
    },
    getMemberAchievements: (handle) => {
      const uuid = shortId();
      dispatch(members.getAchievementsInit(handle, uuid));
      dispatch(members.getAchievementsDone(handle, uuid));
    },
    getMemberFinances: (handle, tokenV3) => {
      const uuid = shortId();
      dispatch(members.getFinancesInit(handle, uuid));
      dispatch(members.getFinancesDone(handle, uuid, tokenV3));
    },
    getMemberStats: (handle, tokenV3) => {
      const uuid = shortId();
      dispatch(members.getStatsInit(handle, uuid));
      dispatch(members.getStatsDone(handle, uuid, tokenV3));
    },
    getSrms: (handle, tokenV3) => {
      const uuid = shortId();
      const a = challengeListingActions.challengeListing;
      dispatch(a.getSrmsInit(uuid));
      dispatch(a.getSrmsDone(uuid, handle, {
        filter: 'status=future',
        orderBy: 'registrationStartAt',
        limit: 3,
      }, tokenV3));
    },
    getTopcoderBlogFeed: () => {
      const uuid = shortId();
      const a = rssActions.rss;
      dispatch(a.getInit(TOPCODER_BLOG_ID, uuid));
      dispatch(a.getDone(TOPCODER_BLOG_ID, uuid, TOPOCDER_BLOG_URL));
    },
    selectChallengeDetailsTab: tab =>
      dispatch(challengeActions.challenge.selectTab(tab)),
    setChallengeListingFilter: (filter) => {
      const cl = challengeListingActions.challengeListing;
      const cls = challengeListingSidebarActions.challengeListing.sidebar;
      dispatch(cl.setFilter(filter));
      dispatch(cls.selectBucket(BUCKETS.ALL));
    },
    switchChallengeFilter: filter =>
      dispatch(dash.switchChallengeFilter(filter)),
    switchShowChallengeFilter:
      show => dispatch(dash.showChallengeFilter(show)),
    switchShowEarnings: show => dispatch(dash.showEarnings(show)),
    switchTab: tab => dispatch(dash.switchTab(tab)),
    unregisterFromChallenge: (auth, challengeId) => {
      const a = challengeActions.challenge;
      dispatch(a.unregisterInit());
      dispatch(a.unregisterDone(auth, challengeId));
    },
  };
}

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardPageContainer);

export default DashboardContainer;
